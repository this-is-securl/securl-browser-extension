import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("../manifest.json", import.meta.url), "utf8"));

assert.equal(manifest.manifest_version, 3);
assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
assert.deepEqual(manifest.permissions, ["contextMenus"]);
assert.equal(manifest.host_permissions, undefined);
assert.equal(manifest.content_scripts, undefined);
assert.deepEqual(manifest.background, {
  service_worker: "background.js",
  type: "module",
});

console.log("manifest boundary verified");
