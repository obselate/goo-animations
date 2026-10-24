package Goo.Animations.Checks

import System
import System.Collections.Generic
import System.IO
import System.IO.Compression
import System.Linq
import System.Reflection.PortableExecutable
import System.Text.RegularExpressions
import System.Xml.Linq

func Main() {
    try {
        ValidatePackage()
    } catch (error Exception) {
        Console.Error.WriteLine(error.Message)
        Environment.ExitCode = 1
    }
}

func Require(condition bool, message string) {
    if !condition {
        throw InvalidDataException(message)
    }
}

func Property(project XDocument, name string) string -> project.Root!!
    .Elements("PropertyGroup")
    .Elements(name)
    .FirstOrDefault()
    ?.Value ??
    ""

func ValidatePackage() {
    let root = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../../"))
    let id = "Goo.Animations"
    let projectDirectory = Path.Combine(root, "src", id)
    let project = XDocument.Load(Path.Combine(projectDirectory, id + ".gsproj"))
    let version = Property(project, "Version")
    Require(
        Regex.IsMatch(version, "\\A(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-[0-9A-Za-z.-]+)?\\z"),
        id + " Version must be SemVer."
    )
    let packagePath = Path.Combine(root, "artifacts/packages", id + "." + version + ".nupkg")
    using let archive = ZipFile.OpenRead(packagePath)
    let required = []string{"lib/net10.0/" + id + ".dll", "lib/net10.0/" + id + ".xml", "README.md", "LICENSE"}
    let missing = required
        .Where(name -> archive.GetEntry(name) == nil)
        .OrderBy(name -> name, StringComparer.Ordinal)
        .ToArray()
    Require(missing.Length == 0, id + " is missing " + String.Join(", ", missing))
    using let assembly = MemoryStream()
    using let source = archive.GetEntry("lib/net10.0/" + id + ".dll")!!.Open()
    source.CopyTo(assembly)
    assembly.Position = 0
    using let pe = PEReader(assembly)
    let entries = pe.ReadDebugDirectory()
    for entry in entries {
        Require(
            entry.DataSize == 0 ||
                (
                entry.DataSize > 0 &&
                    entry.DataPointer >= 0 &&
                    entry.DataPointer +
                    int64(entry.DataSize) <= assembly.Length
            ),
            "Packaged assembly has invalid debug data."
        )
    }
    let embedded = entries.Where(entry -> entry.Type == DebugDirectoryEntryType.EmbeddedPortablePdb).ToArray()
    Require(embedded.Length == 1, "Packaged assembly must contain one embedded portable PDB.")
    using let pdb = pe.ReadEmbeddedPortablePdbDebugDirectoryData(embedded[0])
    pdb.GetMetadataReader()
    using let manifestStream = archive.GetEntry(id + ".nuspec")!!.Open()
    let manifest = XDocument.Load(manifestStream)
    let ns = manifest.Root!!.Name.Namespace
    let metadata = manifest.Root!!.Element(ns + "metadata")!!
    Require(metadata.Element(ns + "version")?.Value == version, "Package version does not match the library.")
    Require(metadata.Element(ns + "license")?.Value == "MIT", id + " must declare MIT.")
    let dependencies = Dictionary[string, string]()
    for item in manifest.Descendants(ns + "dependency") {
        dependencies[item.Attribute("id")!!.Value] = item.Attribute("version")!!.Value
    }
    let expected = Dictionary[string, string]()
    for item in project.Descendants("PackageReference") {
        expected[item.Attribute("Include")!!.Value] = item.Attribute("Version")!!.Value
    }
    for item in project.Descendants("ProjectReference") {
        let referenced = XDocument.Load(Path.Combine(projectDirectory, item.Attribute("Include")!!.Value))
        expected[Property(referenced, "PackageId")] = Property(referenced, "Version")
    }
    Require(
        dependencies.Count == expected.Count && expected.All(
            item -> dependencies.ContainsKey(item.Key) && dependencies[item.Key] == item.Value
        ),
        "Package dependencies do not match the project."
    )
    Require(
        !archive.Entries.Any(
            entry -> entry.FullName.StartsWith("deps/", StringComparison.Ordinal) || entry.FullName.StartsWith(
                "samples/",
                StringComparison.Ordinal
            ) ||
                entry
                .FullName
                .StartsWith("tests/", StringComparison.Ordinal)
        ),
        "Build tooling or consumer source leaked into the package."
    )
    for name in required {
        let target = Path.Combine(root, "artifacts/package", name)
        Directory.CreateDirectory(Path.GetDirectoryName(target)!!)
        archive.GetEntry(name)!!.ExtractToFile(target, true)
    }
    Console.WriteLine(
        "Verified " + Path.GetFileName(packagePath) +
            ": assembly, documentation, licenses, and dependencies {" +
            String.Join(", ", dependencies.Select(item -> "'" + item.Key + "': '" + item.Value + "'")) + "}."
    )
}
