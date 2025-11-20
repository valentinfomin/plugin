# Chrome Web Store Listing

## Store Listing Content

### Name
Text Encrypt/Decrypt

### Short Description (132 characters max)
Encrypt and decrypt text on any webpage using AES encryption. Secure your messages with a shared secret key.

### Detailed Description

**Secure Text Encryption for Any Website**

Text Encrypt/Decrypt is a powerful yet simple Chrome extension that allows you to encrypt and decrypt text on any webpage using military-grade AES encryption. Perfect for securing sensitive information in emails, messages, documents, or any text field.

**Key Features:**

🔒 **Strong Encryption**
- AES-256 encryption with PBKDF2 key derivation
- 10,000 iterations for enhanced security
- Random salt for each encryption

🎯 **Easy to Use**
- Right-click any selected text to encrypt or decrypt
- Simple context menu integration
- Works on any website

🔑 **Flexible Key Management**
- Save keys permanently (synced across devices)
- Session-only storage for temporary use
- Change keys anytime

⚡ **Modern & Fast**
- Built with Manifest V3
- Dynamic script injection for better performance
- No blocking prompts - smooth user experience

🛡️ **Privacy First**
- All encryption happens locally on your device
- No data sent to external servers
- No tracking or analytics
- Open source code

**How It Works:**

1. **Encrypt**: Select text, right-click, choose "Encrypt", enter your secret key
2. **Decrypt**: Select encrypted text, right-click, choose "Decrypt", enter the same key
3. **Share**: Share encrypted text safely - only those with the key can decrypt it

**Perfect For:**
- Securing email content
- Protecting sensitive messages
- Encrypting notes and documents
- Sharing confidential information
- Privacy-conscious communication

**Security Note:**
This extension uses industry-standard AES encryption. However, the security of your data depends on keeping your encryption key secret. Choose strong, unique keys and never share them through insecure channels.

**Open Source:**
The complete source code is available on GitHub for transparency and security auditing.

### Category
Productivity

### Language
English

### Privacy Policy URL
https://github.com/valentinfomin/plugin/blob/main/PRIVACY.md

## Required Assets

### Screenshots (1280x800 or 640x400)
- Screenshot 1: Context menu showing encrypt/decrypt options
- Screenshot 2: Key input modal
- Screenshot 3: Before/after encryption example
- Screenshot 4: Extension icon in toolbar

### Promotional Images
- Small tile: 440x280 (required)
- Marquee: 1400x560 (optional but recommended)

### Icon
- 128x128 (already have - white outline lock)

## Version Information

**Version**: 1.5
**Minimum Chrome Version**: 88 (for Manifest V3 support)

## Permissions Justification

When submitting, you'll need to justify each permission:

- **contextMenus**: Required to add encrypt/decrypt options to right-click menu
- **activeTab**: Needed to access selected text on the current page
- **scripting**: Required to inject encryption scripts dynamically
- **storage**: Stores user's encryption keys (with user consent)
- **notifications**: Displays success/error messages to user
- **host_permissions (<all_urls>)**: Allows encryption on any website user visits

## Single Purpose Statement

"This extension encrypts and decrypts selected text on web pages using AES encryption."
