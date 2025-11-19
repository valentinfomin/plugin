console.log("Text Encrypt/Decrypt extension content script loaded (AES-CBC fix)");

chrome.runtime.onMessage.addListener(async (req) => {
  if (req.action === "changeKey") {
    const keyword = prompt("Enter the new shared secret keyword:");
    if (!keyword) {
      chrome.runtime.sendMessage({
        action: "showNotification",
        text: "Keyword is required!"
      });
      return;
    }
    chrome.storage.sync.set({ encryptionKey: keyword }, () => {
      console.log("New keyword saved to storage");
      chrome.runtime.sendMessage({
        action: "showNotification",
        text: "Encryption key changed successfully!"
      });
    });
    return;
  }

  if (req.action !== "encrypt" && req.action !== "decrypt") return;

  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  if (!selectedText) {
    chrome.runtime.sendMessage({
      action: "showNotification",
      text: "No text selected!"
    });
    return;
  }

  let keyword = req.keyword;
  if (!keyword) {
    keyword = prompt("Enter the shared secret keyword:");
    if (!keyword) {
      chrome.runtime.sendMessage({
        action: "showNotification",
        text: "Keyword is required!"
      });
      return;
    }
    chrome.storage.sync.set({ encryptionKey: keyword }, () => {
      console.log("Keyword saved to storage");
    });
  }

  try {
    let result;

    if (req.action === "encrypt") {
      const salt = CryptoJS.lib.WordArray.random(16);
      const iv = CryptoJS.lib.WordArray.random(16);

      const key = CryptoJS.PBKDF2(keyword, salt, {
        keySize: 8, // 256 bits
        iterations: 10000
      });

      const encrypted = CryptoJS.AES.encrypt(selectedText, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      result =
        salt.toString(CryptoJS.enc.Base64) + "." +
        iv.toString(CryptoJS.enc.Base64) + "." +
        encrypted.ciphertext.toString(CryptoJS.enc.Base64);

      console.log("Encryption OK:", result);

    } else {
      const clean = selectedText.replace(/[\r\n\t ]+/g, "");
      const parts = clean.split(".");
      if (parts.length !== 3) {
        chrome.runtime.sendMessage({
          action: "showNotification",
          text: "Invalid format! Expected SALT.IV.CIPHERTEXT"
        });
        return;
      }

      const [saltB64, ivB64, ctB64] = parts;
      const salt = CryptoJS.enc.Base64.parse(saltB64);
      const iv = CryptoJS.enc.Base64.parse(ivB64);
      const ciphertext = CryptoJS.enc.Base64.parse(ctB64);

      const key = CryptoJS.PBKDF2(keyword, salt, {
        keySize: 8,
        iterations: 10000
      });

      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext },
        key,
        { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );

      result = decrypted.toString(CryptoJS.enc.Utf8);
      if (!result) {
        chrome.runtime.sendMessage({
          action: "showNotification",
          text: "Decryption failed — wrong keyword or corrupted text"
        });
        return;
      }

      console.log("Decryption OK:", result);
    }

    // Replace the selected text (editable or non-editable)
    replaceSelectedText(result, selection);

    // Show notification
    chrome.runtime.sendMessage({
      action: "showNotification",
      text: `${capitalize(req.action)}ion successful!`
    });

  } catch (e) {
    console.error("Encryption/Decryption error:", e);
    chrome.runtime.sendMessage({
      action: "showNotification",
      text: "Error: " + e.message
    });
  }
});

function isSelectionEditable(sel) {
  if (sel.rangeCount === 0) return false;
  const node = sel.getRangeAt(0).commonAncestorContainer;
  const el = node.nodeType === 3 ? node.parentNode : node;
  console.log("Element:", el.tagName, "isContentEditable:", el.isContentEditable);
  return el && (el.isContentEditable || el.tagName === "INPUT" || el.tagName === "TEXTAREA");
}

function replaceSelectedText(txt, sel) {
  if (!sel.rangeCount) {
    console.log("No range in selection");
    return;
  }

  const range = sel.getRangeAt(0);
  const isEditable = isSelectionEditable(sel);
  console.log("Replacing text, isEditable:", isEditable);

  try {
    if (isEditable) {
      // For editable fields, try execCommand first
      try {
        document.execCommand("insertText", false, txt);
        console.log("Used execCommand to insert text");
      } catch (e) {
        console.log("execCommand failed, falling back to range:", e);
        range.deleteContents();
        range.insertNode(document.createTextNode(txt));
      }
    } else {
      // For non-editable fields, wrap in a span
      const span = document.createElement("span");
      span.textContent = txt;
      range.deleteContents();
      range.insertNode(span);
      console.log("Inserted span for non-editable text");
    }

    // Trigger an input event to notify frameworks like React
    const node = range.commonAncestorContainer;
    const el = node.nodeType === 3 ? node.parentNode : node;
    if (el.isContentEditable) {
      const inputEvent = new Event("input", { bubbles: true });
      el.dispatchEvent(inputEvent);
      console.log("Dispatched input event");
    }

    sel.removeAllRanges();
  } catch (e) {
    console.error("Text replacement failed:", e);
    chrome.runtime.sendMessage({
      action: "showNotification",
      text: "Error replacing text: " + e.message
    });
  }
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }