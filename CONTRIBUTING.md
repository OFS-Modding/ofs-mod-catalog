# Submit a mod

Start with a **Mod submission** issue when you want maintainer help preparing the
entry. Experienced authors may open a pull request directly. Acceptance always
happens through a reviewed pull request; issues never modify the signed index by
themselves.

A submission must point to an immutable GitHub Release asset and must not commit
the `.ofmod` package to this repository.

Required metadata:

- stable reverse-DNS-style mod id, display name, author and semantic version;
- SDK version, supported game fingerprints, dependencies, capabilities and multiplayer policy;
- HTTPS release-asset URL, exact byte count and lowercase SHA-256 of the complete `.ofmod` file.
- one original 64×64 PNG thumbnail, hosted by this catalog with its exact byte count and SHA-256.

The package manifest id and version must match the catalog entry. If the package contains Unity AssetBundles, their hashes remain in `Assets/Bundles/ofs-bundles.json`; they are validated independently after the package hash.

Run `npm test` before opening the pull request. Contributors edit
`public/catalog.json` and add the thumbnail under `public/icons/`; maintainers
produce the signed publication through GitHub Actions.

Do not submit copyrighted game assets, credentials, private keys or generated
game dumps.
