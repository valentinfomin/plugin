chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "encrypt",
    title: "Encrypt Selected Text",
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: "decrypt",
    title: "Decrypt Selected Text",
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: "changeKey",
    title: "Change Encryption Key",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab.id) return;

  // Inject scripts first for all actions
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["crypto-js.min.js", "content.js"]
    });
  } catch (err) {
    console.error("Script injection failed:", err);
    return;
  }

  if (info.menuItemId === "encrypt" || info.menuItemId === "decrypt") {
    chrome.storage.sync.get(['encryptionKey'], (result) => {
      chrome.tabs.sendMessage(tab.id, {
        action: info.menuItemId,
        keyword: result.encryptionKey || null
      });
    });
  } else if (info.menuItemId === "changeKey") {
    chrome.tabs.sendMessage(tab.id, { action: "changeKey" });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showNotification") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon48.png",
      title: "Text Encrypt/Decrypt",
      message: message.text
    });
    sendResponse({ status: "notification shown" });
  }
});