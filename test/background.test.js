import assert from "node:assert/strict";
import test from "node:test";

test("registers one HTTP and HTTPS link command and opens the checker", async () => {
  const listeners = {};
  const createdMenus = [];
  const openedTabs = [];

  global.chrome = {
    runtime: {
      lastError: undefined,
      onInstalled: { addListener: (listener) => { listeners.installed = listener; } },
      onStartup: { addListener: (listener) => { listeners.startup = listener; } },
    },
    contextMenus: {
      removeAll: (callback) => callback(),
      create: (options) => createdMenus.push(options),
      onClicked: { addListener: (listener) => { listeners.clicked = listener; } },
    },
    tabs: {
      create: (options, callback) => {
        openedTabs.push(options);
        callback();
      },
      update: () => assert.fail("fallback navigation should not run"),
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
  }, { id: 42 });

  assert.equal(openedTabs.length, 1);
  const opened = new URL(openedTabs[0].url);
  assert.equal(opened.origin + opened.pathname, "https://securl.online/check-link");
  assert.equal(opened.search, "");
  assert.equal(new URLSearchParams(opened.hash.slice(1)).get("url"), "https://example.com/path?a=1&b=2");

  delete global.chrome;
});

test("falls back to the source tab when Chrome rejects a new tab", async () => {
  const listeners = {};
  const updatedTabs = [];

  global.chrome = {
    runtime: {
      lastError: undefined,
      onInstalled: { addListener: () => {} },
      onStartup: { addListener: () => {} },
    },
    contextMenus: {
      removeAll: (callback) => callback(),
      create: () => {},
      onClicked: { addListener: (listener) => { listeners.clicked = listener; } },
    },
    tabs: {
      create: (_options, callback) => {
        global.chrome.runtime.lastError = { message: "New tab blocked" };
        callback();
        global.chrome.runtime.lastError = undefined;
      },
      update: (tabId, options, callback) => {
        updatedTabs.push({ tabId, options });
        global.chrome.runtime.lastError = undefined;
        callback();
      },
    },
  };

  await import(`../background.js?fallback-test=${Date.now()}`);
  listeners.clicked({
    menuItemId: "securl-check-link",
    linkUrl: "https://example.com/fallback",
  }, { id: 99 });

  assert.equal(updatedTabs.length, 1);
  assert.equal(updatedTabs[0].tabId, 99);
  const opened = new URL(updatedTabs[0].options.url);
  assert.equal(opened.origin + opened.pathname, "https://securl.online/check-link");
  assert.equal(new URLSearchParams(opened.hash.slice(1)).get("url"), "https://example.com/fallback");

  delete global.chrome;
});
