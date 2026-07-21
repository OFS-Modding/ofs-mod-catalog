# Security model

OFS mods execute inside the game process and therefore carry full process trust. The signed catalog authenticates reviewed metadata; the package hash detects download substitution or corruption; the package manifest and AssetBundle index provide identity and per-bundle checks.

Signatures and hashes establish provenance and integrity. They do not make arbitrary mod code safe, so catalog review remains mandatory.
