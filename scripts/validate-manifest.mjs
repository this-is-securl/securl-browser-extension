import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("../manifest.json", import.meta.url), "utf8"));

assert.equal(manifest.manifest_version, 3);
assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
assert.deepEqual(manifest.permissions, ["contextMenus"]);
assert.equal(manifest.host_permissions, undefined);
assert.equal(manifest.content_scripts, undefined);
assert.deepEqual(manifest.icons, {
  16: "icons/icon-16.png",
  32: "icons/icon-32.png",
  48: "icons/icon-48.png",
  128: "icons/icon-128.png",
});
assert.deepEqual(manifest.background, {
  service_worker: "background.js",
  type: "module",
});

await Promise.all(
  Object.values(manifest.icons).map((icon) =>
    access(new URL(`../${icon}`, import.meta.url)),
  ),
);

console.log("manifest boundary verified");
