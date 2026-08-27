import { buildCheckerUrl } from "./checker-url.js";

const MENU_ID = "securl-check-link";

function installContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: "Check link with SecURL",
      contexts: ["link"],
      targetUrlPatterns: ["http://*/*", "https://*/*"],
    });
  });
}

chrome.runtime.onInstalled.addListener(installContextMenu);
chrome.runtime.onStartup.addListener(installContextMenu);

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== MENU_ID || !info.linkUrl) return;

  try {
    void chrome.tabs.create({ url: buildCheckerUrl(info.linkUrl) });
  } catch (error) {
    console.warn("SecURL could not prepare that link for inspection.", error);
  }
});
