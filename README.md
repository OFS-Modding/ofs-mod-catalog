<p align="center">
  <img src="assets/logo.png" width="128" alt="OFS-Modding">
</p>

# OFS Mod Catalog

Signed official mod index for Ore Factory Squad. This repository contains only
catalog metadata, public trust material, thumbnails, validation scripts, and
the community submission workflow. The discovery website lives in
[`ofs-mod-portal`](https://github.com/OFS-Modding/ofs-mod-portal).

## Public endpoints

- readable index: <https://ofs-modding.github.io/ofs-mod-catalog/catalog.json>
- signed client index: <https://ofs-modding.github.io/ofs-mod-catalog/catalog.signed.json>
- stable loader channel: <https://ofs-modding.github.io/ofs-mod-catalog/loader.json>

Packages remain immutable GitHub Release assets in their individual mod
repositories. Every entry pins the package URL, exact byte count, SHA-256,
compatibility policy, and a verified 64x64 PNG thumbnail.

To submit a mod, open a **Mod submission** issue or send a pull request following
[`CONTRIBUTING.md`](CONTRIBUTING.md). Catalog signing is performed only by the
protected publication workflow.
