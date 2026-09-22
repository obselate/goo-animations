using GSharp.Core.CodeAnalysis.Syntax;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml.Linq;

var repositoryRoot = FindRepositoryRoot(Environment.CurrentDirectory);
var arguments = ParseArguments(args);
var xmlPath = Resolve(arguments.GetValueOrDefault("xml"),
    Path.Combine(repositoryRoot, "src", "Goo.Animations", "bin", "Release", "net10.0", "Goo.Animations.xml"));
var sourceRoot = Resolve(arguments.GetValueOrDefault("source"),
    Path.Combine(repositoryRoot, "src", "Goo.Animations"));
var outputRoot = Resolve(arguments.GetValueOrDefault("output"),
    Path.Combine(repositoryRoot, "docs", "api"));

if (!File.Exists(xmlPath))
    throw new FileNotFoundException("Build Goo.Animations in Release mode before generating API pages.", xmlPath);

var sourceFiles = Directory.EnumerateFiles(sourceRoot, "*.gs", SearchOption.AllDirectories)
    .Where(path => !Path.GetRelativePath(sourceRoot, path).Split(Path.DirectorySeparatorChar)
        .Any(part => part is "bin" or "obj"))
    .Order(StringComparer.Ordinal)
    .ToArray();
var types = sourceFiles
    .SelectMany(path => ReadTypes(path, sourceRoot))
    .GroupBy(type => type.XmlName, StringComparer.Ordinal)
    .Select(group => group.OrderByDescending(type => type.Sources.Any(source =>
        source.FileName == type.DisplayName.Split('<')[0] + ".gs")).First() with
    {
        Sources = group.SelectMany(type => type.Sources)
            .OrderBy(source => source.RelativeFile, StringComparer.Ordinal)
            .ToArray(),
    })
    .OrderBy(type => type.Category, StringComparer.Ordinal)
    .ThenBy(type => type.DisplayName, StringComparer.Ordinal)
    .ToArray();
var members = XDocument.Load(xmlPath)
    .Descendants("member")
    .Select(element => new ApiMember(
        element.Attribute("name")?.Value ?? throw new InvalidDataException("XML member has no name."),
        element))
    .ToArray();
var categories = types.Select(type => type.Category)
    .Distinct(StringComparer.Ordinal)
    .Order(StringComparer.Ordinal)
    .ToArray();
var matched = new HashSet<string>(StringComparer.Ordinal);
var pages = new Dictionary<string, string>(StringComparer.Ordinal);
foreach (var category in categories)
{
    var pageTypes = types.Where(type => type.Category == category).ToArray();
    pages.Add(category.ToLowerInvariant() + ".md", BuildPage(category, pageTypes, members, matched));
}

var unmatched = members.Select(member => member.Id)
    .Where(id => !matched.Contains(id))
    .Order(StringComparer.Ordinal)
    .ToArray();
if (unmatched.Length != 0)
    throw new InvalidDataException("Unmapped Goo.Animations.xml members:" + Environment.NewLine
        + string.Join(Environment.NewLine, unmatched));

pages.Add("README.md", BuildIndex(categories));
Directory.CreateDirectory(outputRoot);
foreach (var stalePath in Directory.EnumerateFiles(outputRoot, "*.md"))
{
    if (!pages.ContainsKey(Path.GetFileName(stalePath)))
        File.Delete(stalePath);
}
foreach (var (name, markdown) in pages)
    WriteIfChanged(Path.Combine(outputRoot, name), markdown);
Console.WriteLine($"Generated {categories.Length} API pages in {outputRoot}.");

static string BuildPage(string category, ApiType[] types, ApiMember[] members,
    HashSet<string> matched)
{
    var text = new StringBuilder();
    text.AppendLine($"# {category} API");
    text.AppendLine();
    text.AppendLine("Generated from `Goo.Animations.xml`. Source declarations supply type ownership and XML-emitter omissions.");

    foreach (var type in types)
    {
        text.AppendLine();
        text.AppendLine($"## `{type.DisplayName}`");
        text.AppendLine();
        text.AppendLine(type.Sources.Count == 1 ? "Source:" : "Sources:");
        text.AppendLine();
        foreach (var source in type.Sources)
            text.AppendLine($"- [`{source.FileName}`](../../src/Goo.Animations/{source.RelativeFile})");

        var typeId = "T:" + type.XmlName;
        var typeMember = members.SingleOrDefault(member => member.Id == typeId);
        if (typeMember is not null)
        {
            matched.Add(typeId);
            AppendText(text, Summary(typeMember.Element));
        }
        else
        {
            AppendText(text, type.Summary);
        }

        if (type.EnumValues.Count != 0)
        {
            text.AppendLine();
            text.AppendLine("### Values");
            text.AppendLine();
            foreach (var value in type.EnumValues)
                text.AppendLine($"- `{value}`");
        }

        foreach (var member in members
            .Where(member => BelongsTo(member.Id, type.XmlName, type.IsFunction))
            .OrderBy(member => member.Id, StringComparer.Ordinal))
        {
            matched.Add(member.Id);
            text.AppendLine();
            text.AppendLine($"### `{DisplayMember(member, type)}`");
            AppendText(text, Summary(member.Element));

            var parameters = member.Element.Elements("typeparam")
                .Concat(member.Element.Elements("param"))
                .ToArray();
            if (parameters.Length != 0)
            {
                text.AppendLine();
                foreach (var parameter in parameters)
                    text.AppendLine($"- `{parameter.Attribute("name")?.Value}`: {Normalize(parameter.Value)}");
            }

            var returns = Normalize(member.Element.Element("returns")?.Value);
            if (returns.Length != 0)
            {
                text.AppendLine();
                text.AppendLine($"Returns: {returns}");
            }
        }
    }

    return text.ToString();
}

static string BuildIndex(string[] categories)
{
    var text = new StringBuilder();
    text.AppendLine("# Goo Animations API");
    text.AppendLine();
    text.AppendLine("These pages are generated from the Release `Goo.Animations.xml` file.");
    text.AppendLine();
    foreach (var category in categories)
        text.AppendLine($"- [{category}]({category.ToLowerInvariant()}.md)");
    return text.ToString();
}

static IEnumerable<ApiType> ReadTypes(string file, string sourceRoot)
{
    var typePattern = new Regex(
        @"(?m)^public\s+(?:(?:partial|sealed|open|data)\s+)*(?<kind>class|struct|enum|interface)\s+(?<name>[A-Za-z_][A-Za-z0-9_]*)(?<generic>\[[^\]\r\n]+\])?",
        RegexOptions.CultureInvariant);
    var functionPattern = new Regex(
        @"(?m)^func\s+(?:\([^\)\r\n]+\)\s+)?(?<name>[A-Za-z_][A-Za-z0-9_]*)(?<generic>\[[^\]\r\n]+\])?",
        RegexOptions.CultureInvariant);
    var source = File.ReadAllText(file);
    foreach (Match match in typePattern.Matches(source).Concat(functionPattern.Matches(source)))
    {
        var name = match.Groups["name"].Value;
        var isFunction = match.Groups["kind"].Value.Length == 0;
        if (isFunction && name == "operator")
            continue;
        var generic = match.Groups["generic"].Value;
        var arity = generic.Length == 0 ? 0 : generic.Count(character => character == ',') + 1;
        var xmlName = "Goo.Animations." + name
            + (arity == 0 ? "" : (isFunction ? "``" : "`") + arity);
        var values = match.Groups["kind"].Value == "enum"
            ? ReadEnumValues(source, match.Index + match.Length)
            : [];
        var relativeFile = Path.GetRelativePath(sourceRoot, file)
            .Replace(Path.DirectorySeparatorChar, '/');
        var directory = Path.GetDirectoryName(relativeFile);
        var category = string.IsNullOrEmpty(directory)
            ? "Motion"
            : directory.Split(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar)[0];
        yield return new ApiType(
            category,
            name + generic.Replace('[', '<').Replace(']', '>'),
            xmlName,
            ReadSourceSummary(source, match.Index),
            values,
            [new ApiSource(relativeFile, Path.GetFileName(file))],
            isFunction);
    }
}

static IReadOnlyList<string> ReadEnumValues(string source, int start) =>
    SyntaxTree.Parse(source).Root.Members.OfType<EnumDeclarationSyntax>()
        .Single(declaration => declaration.Span.Start < start && declaration.Span.End > start)
        .Members.Select(member => member.Identifier.Text).ToArray();

static string ReadSourceSummary(string source, int declarationStart)
{
    var lines = source[..declarationStart].Replace("\r\n", "\n").Split('\n').ToList();
    while (lines.Count != 0 && lines[^1].Trim().Length == 0)
        lines.RemoveAt(lines.Count - 1);
    while (lines.Count != 0 && lines[^1].TrimStart().StartsWith("/// @", StringComparison.Ordinal))
        lines.RemoveAt(lines.Count - 1);
    var summary = new List<string>();
    while (lines.Count != 0 && lines[^1].TrimStart().StartsWith("///", StringComparison.Ordinal))
    {
        summary.Add(lines[^1].TrimStart()[3..].Trim());
        lines.RemoveAt(lines.Count - 1);
    }
    summary.Reverse();
    return Normalize(string.Join(' ', summary));
}

static bool BelongsTo(string id, string xmlTypeName, bool isFunction) =>
    isFunction ? id.StartsWith("M:" + xmlTypeName + "(", StringComparison.Ordinal) :
    id.StartsWith("M:" + xmlTypeName + ".", StringComparison.Ordinal) ||
    id.StartsWith("P:" + xmlTypeName + ".", StringComparison.Ordinal) ||
    id.StartsWith("F:" + xmlTypeName + ".", StringComparison.Ordinal) ||
    id.StartsWith("E:" + xmlTypeName + ".", StringComparison.Ordinal);

static string DisplayMember(ApiMember member, ApiType type)
{
    var value = type.IsFunction
        ? type.DisplayName + member.Id[(type.XmlName.Length + 2)..]
        : member.Id[(type.XmlName.Length + 3)..];
    var methodParameters = member.Element.Elements("typeparam")
        .Select(element => element.Attribute("name")?.Value ?? "T")
        .ToArray();
    var parameterStart = value.IndexOf('(');
    var name = parameterStart < 0 ? value : value[..parameterStart];
    var arity = Regex.Match(name, @"``(?<arity>\d+)");
    if (methodParameters.Length == 0 && arity.Success)
        methodParameters = GenericParameterNames(int.Parse(arity.Groups["arity"].Value));
    if (methodParameters.Length == 0 && type.IsFunction)
        methodParameters = GenericNames(type.DisplayName);
    if (arity.Success)
        value = value.Remove(arity.Index, arity.Length)
            .Insert(arity.Index, "<" + string.Join(", ", methodParameters) + ">");
    for (var index = 0; index < methodParameters.Length; index++)
        value = value.Replace("``" + index, methodParameters[index], StringComparison.Ordinal);
    var typeParameters = GenericNames(type.DisplayName);
    for (var index = 0; index < typeParameters.Length; index++)
        value = value.Replace("`" + index, typeParameters[index], StringComparison.Ordinal);
    return value
        .Replace("#ctor", "new", StringComparison.Ordinal)
        .Replace("System.Boolean", "bool", StringComparison.Ordinal)
        .Replace("System.Double", "float64", StringComparison.Ordinal)
        .Replace("System.Single", "float32", StringComparison.Ordinal)
        .Replace("System.Int32", "int32", StringComparison.Ordinal)
        .Replace("System.String", "string", StringComparison.Ordinal)
        .Replace("Goo.Animations.", "", StringComparison.Ordinal)
        .Replace("Goo.", "", StringComparison.Ordinal);
}

static string[] GenericParameterNames(int count) => Enumerable.Range(0, count)
    .Select(index => index == 0 ? "T" : "T" + (index + 1))
    .ToArray();

static string[] GenericNames(string displayName)
{
    var open = displayName.IndexOf('<');
    return open < 0
        ? []
        : displayName[(open + 1)..^1].Split(',', StringSplitOptions.TrimEntries);
}

static string Summary(XElement element) => Normalize(element.Element("summary")?.Value);

static string Normalize(string? value) => Regex.Replace(value ?? "", @"\s+", " ").Trim();

static void AppendText(StringBuilder text, string value)
{
    if (value.Length == 0)
        return;
    text.AppendLine();
    text.AppendLine(value);
}

static void WriteIfChanged(string path, string content)
{
    content = content.Replace("\r\n", "\n");
    if (File.Exists(path) && File.ReadAllText(path) == content)
        return;
    Directory.CreateDirectory(Path.GetDirectoryName(path)!);
    File.WriteAllText(path, content, new UTF8Encoding(false));
}

static Dictionary<string, string> ParseArguments(string[] values)
{
    var result = new Dictionary<string, string>(StringComparer.Ordinal);
    for (var index = 0; index < values.Length; index += 2)
    {
        if (!values[index].StartsWith("--", StringComparison.Ordinal) || index + 1 >= values.Length)
            throw new ArgumentException("Use --xml, --source, or --output followed by a path.");
        result[values[index][2..]] = values[index + 1];
    }
    return result;
}

static string Resolve(string? value, string fallback) => Path.GetFullPath(value ?? fallback);

static string FindRepositoryRoot(string start)
{
    for (var directory = new DirectoryInfo(start); directory is not null; directory = directory.Parent)
    {
        if (File.Exists(Path.Combine(directory.FullName, "Goo.Animations.slnx")))
            return directory.FullName;
    }
    throw new DirectoryNotFoundException("Could not find the Goo Animations repository root.");
}

sealed record ApiType(
    string Category,
    string DisplayName,
    string XmlName,
    string Summary,
    IReadOnlyList<string> EnumValues,
    IReadOnlyList<ApiSource> Sources,
    bool IsFunction);

sealed record ApiSource(string RelativeFile, string FileName);

sealed record ApiMember(string Id, XElement Element);
