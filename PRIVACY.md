# Privacy Policy for Text Encrypt/Decrypt Extension

**Last Updated: November 19, 2025**

## Overview

Text Encrypt/Decrypt is a Chrome extension that allows users to encrypt and decrypt text on web pages using AES encryption. This privacy policy explains how the extension handles user data.

## Data Collection

### What We Collect
- **Encryption Keys**: When you choose to save your encryption key, it is stored locally in Chrome's sync storage.
- **No Personal Information**: We do not collect, transmit, or store any personal information, browsing history, or website content.

### How We Use Data
- **Encryption Keys**: Used solely for encrypting and decrypting text as requested by the user.
- **Local Storage Only**: All data is stored locally on your device using Chrome's storage API.
- **No External Transmission**: No data is sent to external servers or third parties.

## Data Storage

### Chrome Sync Storage
- If you choose to save your encryption key, it is stored in Chrome's sync storage
- This allows the key to sync across your Chrome browsers where you're signed in
- You can delete stored keys at any time by using the "Change Key" option

### Session Storage
- You can choose "Session Only" storage, which keeps the key only for the current browser session
- Session keys are automatically cleared when you close your browser

## Third-Party Services

This extension does not use any third-party services, analytics, or tracking tools.

## Permissions Explained

The extension requires the following permissions:

- **contextMenus**: To add encrypt/decrypt options to the right-click menu
- **activeTab**: To access the currently active tab for text encryption/decryption
- **scripting**: To inject encryption scripts into web pages
- **storage**: To save encryption keys locally (if you choose to save them)
- **notifications**: To display success/error messages
- **host_permissions (<all_urls>)**: To allow encryption/decryption on any website you visit

## Data Security

- All encryption is performed locally on your device
- We use industry-standard AES encryption with PBKDF2 key derivation
- Your encryption keys are never transmitted over the internet
- No data is collected or stored on external servers

## User Control

You have full control over your data:
- Choose whether to save encryption keys or use session-only storage
- Change or delete your encryption key at any time
- Uninstall the extension to remove all stored data

## Children's Privacy

This extension does not knowingly collect information from children under 13 years of age.

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be reflected in the "Last Updated" date above.

## Contact

For questions about this privacy policy, please open an issue on our GitHub repository.

## Open Source

This extension is open source. You can review the complete source code on GitHub to verify our privacy practices.

---

**Note**: This extension is provided "as is" without warranty of any kind. Users are responsible for the security of their encryption keys and encrypted data.
