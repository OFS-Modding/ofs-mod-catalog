import { createPrivateKey, createPublicKey, sign } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const destination = process.argv[2];
const privatePem = process.env.OFS_CATALOG_PRIVATE_KEY_PEM;
if (!destination || !privatePem) throw new Error("Destination and OFS_CATALOG_PRIVATE_KEY_PEM are required");

const root = new URL("../", import.meta.url);
const payload = await readFile(new URL("public/catalog.json", root));
const expectedPublic = createPublicKey(await readFile(new URL("keys/catalog-2026.pub", root), "utf8"));
const privateKey = createPrivateKey(privatePem);
if (createPublicKey(privateKey).export({ type: "spki", format: "der" }).compare(
  expectedPublic.export({ type: "spki", format: "der" })) !== 0) {
  throw new Error("Signing key does not match the pinned catalog public key");
}

const signature = sign("sha256", payload, { key: privateKey, dsaEncoding: "ieee-p1363" });
const envelope = {
  schemaVersion: 1,
  keyId: "ofs.catalog.2026",
  algorithm: "ECDSA_P256_SHA256",
  payload: payload.toString("base64"),
  signature: signature.toString("base64"),
};
await writeFile(destination, `${JSON.stringify(envelope, null, 2)}\n`, { flag: "w" });
console.log(`signed ${payload.length} catalog bytes for ${destination}`);
