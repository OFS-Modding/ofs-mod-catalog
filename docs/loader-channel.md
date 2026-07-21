# Official loader channel

`public/loader.json` is the stable discovery document for the official Windows
loader. The website links directly to `installerUrl`. Its exact byte count and
SHA-256 are published alongside `installerChecksumUrl`; `releaseApiUrl` remains
available for update clients.

The single executable embeds the complete release archive, validates confined
paths and every entry in `SHA256SUMS`, and then invokes its embedded manager.
`developerArchiveUrl` exposes the equivalent ZIP for tooling and CI. Mod
packages remain independently versioned and hashed in the signed mod catalog.
