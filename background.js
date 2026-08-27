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

chrome.contextMenus.onClicked.addListener((info, sourceTab) => {
  if (info.menuItemId !== MENU_ID || !info.linkUrl) return;

  try {
    const url = buildCheckerUrl(info.linkUrl);
    chrome.tabs.create({ url }, () => {
      if (!chrome.runtime.lastError) return;

      const createError = chrome.runtime.lastError.message;
      if (Number.isInteger(sourceTab?.id)) {
        chrome.tabs.update(sourceTab.id, { url }, () => {
          if (chrome.runtime.lastError) {
            console.warn("SecURL could not open the checker.", {
              createError,
              updateError: chrome.runtime.lastError.message,
            });
          }
        });
        return;
      }

      console.warn("SecURL could not open the checker.", createError);
    });
  } catch (error) {
    console.warn("SecURL could not prepare that link for inspection.", error);
  }
});
