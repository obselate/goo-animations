# Releasing Goo Animations

Releases use the `obselate/goo-animations` GitHub repository and NuGet Trusted
Publishing.

## First release setup

1. Create the GitHub `release` environment.
2. Set repository variable `NUGET_USER` to the publishing account.
3. Create a NuGet Trusted Publishing policy for owner `obselate`, repository
   `goo-animations`, workflow `ci.yml`, environment `release`, and package
   `Goo.Animations`. Allow new package creation for the first release.

## Release

1. Publish any new Goo dependency first.
2. Update the library version, dependency pins and locks, README, and dated
   changelog entry.
3. Run `bash scripts/verify.sh` and check a clean consumer of the built package.
4. Commit and push `main`, then require green CI for that commit.
5. Create and push an annotated matching `v<Version>` tag.
6. The tag workflow verifies, publishes through NuGet Trusted Publishing, and
   creates a GitHub release with the package and its checksum.
7. Confirm the version on NuGet.org and restore it in a clean package consumer.

Do not move a published tag or reuse a published version. A failed release job may
be rerun for the same tag.
