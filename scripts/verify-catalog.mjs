import { createHash, createPublicKey, verify } from "node:crypto";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const catalogBytes = await readFile(new URL("public/catalog.json", root));
const catalog = JSON.parse(catalogBytes);
const loader = JSON.parse(await readFile(new URL("public/loader.json", root), "utf8"));
if (loader.schemaVersion !== 2 || !/^\d+\.\d+\.\d+$/.test(loader.version) ||
    loader.platform !== "win-x64" || !Number.isSafeInteger(loader.installerBytes) ||
    loader.installerBytes <= 0 || !/^[a-f0-9]{64}$/.test(loader.installerSha256)) {
  throw new Error("Official loader channel identity or integrity metadata is invalid");
}
if (loader.installerUrl !==
      "https://github.com/OFS-Modding/ofs-loader/releases/latest/download/OFS-Installer-win-x64.exe" ||
    loader.installerChecksumUrl !== `${loader.installerUrl}.sha256` ||
    !loader.developerArchiveUrl.includes(
      `/OFS-Modding/ofs-loader/releases/download/v${loader.version}/OFS-Loader-${loader.version}-win-x64.zip`)) {
  throw new Error("Official loader channel URLs are invalid");
}
const installerChecksumResponse = await fetch(loader.installerChecksumUrl);
if (!installerChecksumResponse.ok) {
  throw new Error(`Official installer checksum download failed: ${installerChecksumResponse.status}`);
}
const installerChecksum = (await installerChecksumResponse.text()).trim().split(/\s+/);
if (installerChecksum[0] !== loader.installerSha256 ||
    installerChecksum[1] !== "OFS-Installer-win-x64.exe") {
  throw new Error("Official installer checksum sidecar differs from loader.json");
}
if (!process.argv.includes("--source-only")) {
  const envelope = JSON.parse(await readFile(new URL("public/catalog.signed.json", root), "utf8"));
  const publicKey = createPublicKey(await readFile(new URL("keys/catalog-2026.pub", root), "utf8"));
  const payload = Buffer.from(envelope.payload, "base64");
  const signature = Buffer.from(envelope.signature, "base64");
  if (!payload.equals(catalogBytes)) throw new Error("Signed payload differs from public/catalog.json");
  if (envelope.keyId !== "ofs.catalog.2026" || envelope.algorithm !== "ECDSA_P256_SHA256") {
    throw new Error("Unexpected catalog signing identity or algorithm");
  }
  if (!verify("sha256", payload, { key: publicKey, dsaEncoding: "ieee-p1363" }, signature)) {
    throw new Error("Catalog signature is invalid");
  }
}

const identities = new Set();
for (const mod of catalog.mods) {
  const identity = `${mod.id}@${mod.version}`;
  if (identities.has(identity)) throw new Error(`Duplicate catalog entry: ${identity}`);
  identities.add(identity);
  if (!mod.package.url.startsWith("https://github.com/OFS-Modding/") || !mod.package.url.includes("/releases/download/")) {
    throw new Error(`${identity} does not use an immutable OFS-Modding GitHub Release URL`);
  }
  const response = await fetch(mod.package.url);
  if (!response.ok) throw new Error(`${identity} download failed: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (bytes.length !== mod.package.bytes || digest !== mod.package.sha256) {
    throw new Error(`${identity} package integrity mismatch`);
  }
  if (!mod.thumbnail?.url.endsWith(".png")) throw new Error(`${identity} requires a PNG thumbnail`);
  const thumbnailName = new URL(mod.thumbnail.url).pathname.split("/").pop();
  const thumbnail = await readFile(new URL(`public/icons/${thumbnailName}`, root));
  const thumbnailDigest = createHash("sha256").update(thumbnail).digest("hex");
  const pngSignature = "89504e470d0a1a0a";
  const width = thumbnail.length >= 24 ? thumbnail.readUInt32BE(16) : 0;
  const height = thumbnail.length >= 24 ? thumbnail.readUInt32BE(20) : 0;
  if (thumbnail.subarray(0, 8).toString("hex") !== pngSignature || width !== 64 || height !== 64) {
    throw new Error(`${identity} thumbnail must be a 64x64 PNG`);
  }
  if (thumbnail.length !== mod.thumbnail.bytes || thumbnailDigest !== mod.thumbnail.sha256) {
    throw new Error(`${identity} thumbnail integrity mismatch`);
  }
  console.log(`verified ${identity} (${bytes.length} bytes, ${digest})`);
}

console.log(`verified loader ${loader.version} and catalog source with ${catalog.mods.length} entries`);
