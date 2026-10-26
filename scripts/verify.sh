#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

lint_commit=738e2fa1917cd49d7b87577787bcf71e8a709883
lint_hash=6cf35edfa41761ba4afea655a2cc848ae74790b70c9425737405e88d85e3eaf2
lint_source=deps/Gslint/Program.gs
if [[ ! -f "$lint_source" ]]; then
  mkdir -p deps/Gslint
  curl --fail --location --silent --show-error --retry 5 --retry-all-errors --retry-delay 2 \
    "https://raw.githubusercontent.com/obselate/goo/$lint_commit/tools/Goo.Gslint/Program.gs" \
    --output "$lint_source"
fi
printf '%s  %s\n' "$lint_hash" "$lint_source" | sha256sum --check --status

dotnet restore tools/Gslint/Gslint.gsproj --locked-mode
dotnet build tools/Gslint/Gslint.gsproj -c Release --no-restore --nologo -warnaserror
dotnet tools/Gslint/bin/Release/net10.0/Gslint.dll --strict src samples tests
dotnet restore Goo.Animations.slnx --locked-mode
dotnet build Goo.Animations.slnx -c Release --no-restore --nologo
dotnet pack src/Goo.Animations/Goo.Animations.gsproj -c Release --no-build --no-restore -o artifacts/packages
dotnet run --project tools/Goo.Animations.Checks/Goo.Animations.Checks.gsproj -c Release
version="$(dotnet msbuild src/Goo.Animations/Goo.Animations.gsproj -getProperty:Version -nologo)"
dotnet restore tests/Goo.Animations.PackageSmoke/Goo.Animations.PackageSmoke.gsproj --locked-mode
dotnet run --project tests/Goo.Animations.PackageSmoke/Goo.Animations.PackageSmoke.gsproj \
  -c Release --no-restore

(
  cd artifacts/packages
  sha256sum "Goo.Animations.$version.nupkg" > SHA256SUMS
)

git diff --check
