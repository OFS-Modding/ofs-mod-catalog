# Catalog format

The client consumes `catalog.signed.json`, an ECDSA P-256/SHA-256 envelope whose payload is the exact bytes of `catalog.json`. The public key is pinned by the loader; the private key is never committed.

Each version entry identifies a mod by stable `id` plus semantic `version` and declares SDK and game compatibility, dependencies, capabilities, multiplayer policy and package metadata.

## Package identity and integrity

`package.url` must be an immutable HTTPS GitHub Release asset. `package.bytes` is the exact asset size and `package.sha256` is the lowercase SHA-256 of the complete `.ofmod` file.

The client verifies, in order:

1. catalog envelope signature and trusted key id;
2. target game fingerprint and SDK compatibility;
3. dependency resolution;
4. package byte count and SHA-256 while downloading;
5. package layout and manifest id/version;
6. each AssetBundle byte count and SHA-256 from `Assets/Bundles/ofs-bundles.json`.

The catalog does not duplicate individual bundle hashes. They are package-internal data authenticated transitively by the package hash.

Every entry also requires an original 64×64 PNG thumbnail. Its URL, byte count
and SHA-256 are authenticated by the signed catalog and validated before the
in-game browser caches it.

## Updates

New versions are appended as new entries. Existing release assets and entries are immutable. A maintainer verifies and merges the source change; the protected Pages workflow signs the exact published catalog bytes without exposing the private key to pull requests.
