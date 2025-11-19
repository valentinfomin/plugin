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

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "encrypt" || info.menuItemId === "decrypt") {
    chrome.storage.sync.get(['encryptionKey'], (result) => {
      chrome.tabs.update(tab.id, { active: true }, () => {
        chrome.tabs.sendMessage(tab.id, {
          action: info.menuItemId,
          keyword: result.encryptionKey || null
        });
      });
    });
  } else if (info.menuItemId === "changeKey") {
    chrome.tabs.update(tab.id, { active: true }, () => {
      chrome.tabs.sendMessage(tab.id, { action: "changeKey" });
    });
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