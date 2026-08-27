import assert from "node:assert/strict";
import test from "node:test";

test("registers one HTTP and HTTPS link command and opens the checker", async () => {
  const listeners = {};
  const createdMenus = [];
  const openedTabs = [];

  global.chrome = {
    runtime: {
      onInstalled: { addListener: (listener) => { listeners.installed = listener; } },
      onStartup: { addListener: (listener) => { listeners.startup = listener; } },
    },
    contextMenus: {
      removeAll: (callback) => callback(),
      create: (options) => createdMenus.push(options),
      onClicked: { addListener: (listener) => { listeners.clicked = listener; } },
    },
    tabs: {
      create: async (options) => { openedTabs.push(options); },
    },
  };

  await import(`../background.js?test=${Date.now()}`);
  listeners.installed();

  assert.deepEqual(createdMenus, [{
    id: "securl-check-link",
    title: "Check link with SecURL",
    contexts: ["link"],
    targetUrlPatterns: ["http://*/*", "https://*/*"],
  }]);

  listeners.clicked({
    menuItemId: "securl-check-link",
    linkUrl: "https://example.com/path?a=1&b=2",
  });
  await Promise.resolve();

  assert.equal(openedTabs.length, 1);
  const opened = new URL(openedTabs[0].url);
  assert.equal(opened.origin + opened.pathname, "https://securl.online/check-link");
  assert.equal(opened.search, "");
  assert.equal(new URLSearchParams(opened.hash.slice(1)).get("url"), "https://example.com/path?a=1&b=2");

  delete global.chrome;
});
