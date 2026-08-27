import assert from "node:assert/strict";
import test from "node:test";

import { buildCheckerUrl } from "../checker-url.js";

test("keeps the selected link in the fragment", () => {
  const selected = "https://example.com/path?a=1&next=https%3A%2F%2Fother.example";
  const handoff = new URL(buildCheckerUrl(selected));

  assert.equal(handoff.origin + handoff.pathname, "https://securl.online/check-link");
  assert.equal(handoff.search, "");
  assert.equal(new URLSearchParams(handoff.hash.slice(1)).get("url"), selected);
  assert.equal(new URLSearchParams(handoff.hash.slice(1)).get("source"), "browser_extension");
});

test("supports HTTP links", () => {
  const handoff = buildCheckerUrl("http://example.com");
  assert.match(handoff, /^https:\/\/securl\.online\/check-link#/);
});

test("rejects non-web schemes", () => {
  assert.throws(() => buildCheckerUrl("javascript:alert(1)"), /Only public HTTP and HTTPS/);
  assert.throws(() => buildCheckerUrl("file:///tmp/example"), /Only public HTTP and HTTPS/);
  assert.throws(() => buildCheckerUrl("mailto:hello@example.com"), /Only public HTTP and HTTPS/);
});

test("requires a link", () => {
  assert.throws(() => buildCheckerUrl(""), /required/);
  assert.throws(() => buildCheckerUrl(null), /required/);
});
