if (!window.textEncryptDecryptLoaded) {
  window.textEncryptDecryptLoaded = true;
  console.log("Text Encrypt/Decrypt extension content script loaded (v1.5)");

  let sessionKey = null;

  chrome.runtime.onMessage.addListener(async (req, sender, sendResponse) => {
    // Prevent multiple listeners if somehow injected multiple times without the guard working (unlikely)

    if (req.action === "changeKey") {
      try {
        const keyData = await askForKey("Enter new encryption key:", true);
        if (keyData) {
          if (keyData.save) {
            chrome.storage.sync.set({ encryptionKey: keyData.key }, () => {
              showNotification("Encryption key saved to storage!");
            });
          } else {
            sessionKey = keyData.key;
            // Clear storage if they chose session-only, to be safe? 
            // Or just update session key. Let's just update session key and maybe clear storage if they explicitly want "session only" implies "not in storage".
            // For "change key", if they say "session only", we should probably clear the permanent storage.
            chrome.storage.sync.remove('encryptionKey');
            showNotification("Encryption key set for this session only.");
          }
        }
      } catch (e) {
        // User cancelled
      }
      return;
    }

    if (req.action !== "encrypt" && req.action !== "decrypt") return;

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (!selectedText) {
      showNotification("No text selected!");
      return;
    }

    let keyword = req.keyword || sessionKey;

    if (!keyword) {
      try {
        const keyData = await askForKey("Enter encryption key:");
        keyword = keyData.key;
        if (keyData.save) {
          chrome.storage.sync.set({ encryptionKey: keyword });
        } else {
          sessionKey = keyword;
        }
      } catch (e) {
        return; // Cancelled
      }
    }

    try {
      let result;
      if (req.action === "encrypt") {
        result = await encryptText(selectedText, keyword);
        console.log("Encryption OK");
      } else {
        result = await decryptText(selectedText, keyword);
        if (!result) {
          showNotification("Decryption failed — wrong keyword or corrupted text");
          return;
        }
        console.log("Decryption OK");
      }

      replaceSelectedText(result, selection);
      showNotification(`${capitalize(req.action)}ion successful!`);

    } catch (e) {
      console.error("Operation error:", e);
      showNotification("Error: " + e.message);
    }
  });
}

// --- Helper Functions ---

function showNotification(text) {
  chrome.runtime.sendMessage({
    action: "showNotification",
    text: text
  });
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

async function encryptText(text, keyword) {
  const salt = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);

  const key = CryptoJS.PBKDF2(keyword, salt, {
    keySize: 8, // 256 bits
    iterations: 310000 // Increased security
  });

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return salt.toString(CryptoJS.enc.Base64) + "." +
    iv.toString(CryptoJS.enc.Base64) + "." +
    encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

async function decryptText(text, keyword) {
  try {
    const clean = text.replace(/[\r\n\t ]+/g, "");
    const parts = clean.split(".");
    if (parts.length !== 3) throw new Error("Invalid format");

    const [saltB64, ivB64, ctB64] = parts;
    const salt = CryptoJS.enc.Base64.parse(saltB64);
    const iv = CryptoJS.enc.Base64.parse(ivB64);
    const ciphertext = CryptoJS.enc.Base64.parse(ctB64);

    const key = CryptoJS.PBKDF2(keyword, salt, {
      keySize: 8,
      iterations: 310000 // Must match encryption
    });

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext },
      key,
      { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Decryption error:", e);
    return null;
  }
}

function replaceSelectedText(txt, sel) {
  if (!sel.rangeCount) return;
  const range = sel.getRangeAt(0);

  // Check if editable
  let node = range.commonAncestorContainer;
  let el = node.nodeType === 3 ? node.parentNode : node;
  const isEditable = el.isContentEditable || el.tagName === "INPUT" || el.tagName === "TEXTAREA";

  if (isEditable) {
    try {
      document.execCommand("insertText", false, txt);
    } catch (e) {
      range.deleteContents();
      range.insertNode(document.createTextNode(txt));
    }
    // Dispatch input event
    if (el.isContentEditable) {
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  } else {
    const span = document.createElement("span");
    span.textContent = txt;
    span.style.backgroundColor = "#e6f7ff"; // Light highlight to show it changed
    span.style.border = "1px solid #1890ff";
    span.style.borderRadius = "2px";
    span.style.padding = "0 2px";
    range.deleteContents();
    range.insertNode(span);
  }
  sel.removeAllRanges();
}

// --- UI Functions ---

function askForKey(title, isChangeKey = false) {
  return new Promise((resolve, reject) => {
    const host = document.createElement("div");
    host.style.all = "initial";
    host.style.position = "fixed";
    host.style.zIndex = "2147483647";
    host.style.top = "0";
    host.style.left = "0";
    host.style.width = "100vw";
    host.style.height = "100vh";
    host.style.display = "flex";
    host.style.justifyContent = "center";
    host.style.alignItems = "center";
    host.style.backgroundColor = "rgba(0,0,0,0.5)";
    host.style.backdropFilter = "blur(2px)";

    const shadow = host.attachShadow({ mode: "closed" });

    const style = document.createElement("style");
    style.textContent = `
      .modal {
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        width: 320px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        animation: popIn 0.2s ease-out;
      }
      @keyframes popIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      h2 { margin: 0; font-size: 18px; color: #333; }
      input[type="password"], input[type="text"] {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 16px;
        box-sizing: border-box;
      }
      input:focus { outline: 2px solid #007bff; border-color: transparent; }
      .checkbox-wrapper { display: flex; alignItems: center; gap: 8px; font-size: 14px; color: #666; }
      .buttons { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
      button {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background 0.2s;
      }
      button.cancel { background: #f5f5f5; color: #333; }
      button.cancel:hover { background: #e0e0e0; }
      button.submit { background: #007bff; color: white; }
      button.submit:hover { background: #0056b3; }
    `;

    const modal = document.createElement("div");
    modal.className = "modal";

    const header = document.createElement("h2");
    header.textContent = title;

    const input = document.createElement("input");
    input.type = "password";
    input.placeholder = "Secret Key";
    input.autofocus = true;

    const checkboxWrapper = document.createElement("label");
    checkboxWrapper.className = "checkbox-wrapper";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = false;
    checkboxWrapper.appendChild(checkbox);
    checkboxWrapper.appendChild(document.createTextNode(isChangeKey ? "Save to storage" : "Save for this session only"));

    // Logic flip: 
    // If changing key: "Save to storage" (default checked?) -> if unchecked, session only.
    // If asking for key: "Save for this session only" (default unchecked) -> if checked, session only.
    // Let's standardize: "Remember me" style.
    // Let's stick to the plan: "Save for this session only" checkbox.

    if (isChangeKey) {
      checkboxWrapper.innerHTML = ''; // clear
      checkbox.checked = true;
      checkboxWrapper.appendChild(checkbox);
      checkboxWrapper.appendChild(document.createTextNode("Save key permanently"));
    }

    const btnContainer = document.createElement("div");
    btnContainer.className = "buttons";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "cancel";
    cancelBtn.textContent = "Cancel";

    const submitBtn = document.createElement("button");
    submitBtn.className = "submit";
    submitBtn.textContent = "Submit";

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(submitBtn);

    modal.appendChild(header);
    modal.appendChild(input);
    modal.appendChild(checkboxWrapper);
    modal.appendChild(btnContainer);

    shadow.appendChild(style);
    shadow.appendChild(modal);

    document.body.appendChild(host);

    // Focus input
    setTimeout(() => input.focus(), 50);

    function close() {
      document.body.removeChild(host);
    }

    cancelBtn.onclick = () => {
      close();
      reject("Cancelled");
    };

    submitBtn.onclick = () => {
      const val = input.value;
      if (!val) {
        input.style.borderColor = "red";
        return;
      }
      // Determine save state based on context
      let shouldSave = false;
      if (isChangeKey) {
        shouldSave = checkbox.checked;
      } else {
        shouldSave = !checkbox.checked; // If "Save for session only" is checked, save is false.
      }

      close();
      resolve({ key: val, save: shouldSave });
    };

    input.onkeydown = (e) => {
      if (e.key === "Enter") submitBtn.click();
      if (e.key === "Escape") cancelBtn.click();
    };
  });
}