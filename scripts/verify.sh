#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

lint_commit=7c9444a4fefd10fa9423ee50307e2aaed7c6842e
lint_hash=27b69ec4e2569e9e1e036dc96dfc5dfb580144909aa77eec2b0d04d209714764
lint_source=deps/Gslint/Program.cs
if [[ ! -f "$lint_source" ]]; then
  mkdir -p deps/Gslint
  curl --fail --location --silent --show-error --retry 3 \
    "https://raw.githubusercontent.com/obselate/goo/$lint_commit/tools/Goo.Gslint/Program.cs" \
    --output "$lint_source"
fi
printf '%s  %s\n' "$lint_hash" "$lint_source" | sha256sum --check --status

dotnet restore tools/Gslint/Gslint.csproj --locked-mode
dotnet build tools/Gslint/Gslint.csproj -c Release --no-restore --nologo -warnaserror
dotnet tools/Gslint/bin/Release/net10.0/Gslint.dll --strict src samples
dotnet restore Goo.Animations.slnx --locked-mode
dotnet build Goo.Animations.slnx -c Release --no-restore --nologo
dotnet pack src/Goo.Animations/Goo.Animations.gsproj -c Release --no-build --no-restore -o artifacts/packages
python3 scripts/verify-package.py

(
  cd artifacts/packages
  version="$(dotnet msbuild ../../src/Goo.Animations/Goo.Animations.gsproj -getProperty:Version -nologo)"
  sha256sum "Goo.Animations.$version.nupkg" > SHA256SUMS
)

git diff --check
