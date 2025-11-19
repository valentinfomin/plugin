## Support
If you like my work, consider supporting me:
[Buy me a coffee ☕](https://www.buymeacoffee.com/watchdogalert)

# Text Encrypt/Decrypt Chrome Extension

A Chrome extension that allows you to encrypt and decrypt selected text on any webpage using AES encryption with a shared secret key.

## Features

- 🔒 **AES Encryption**: Secure text encryption using CryptoJS library
- 🔑 **Key Management**: Store encryption keys in Chrome sync storage or session-only
- 🎨 **Modern UI**: Custom modal for key input (no blocking browser prompts)
- ⚡ **Dynamic Injection**: Scripts load only when needed for better performance
- 🌐 **Works Everywhere**: Encrypt/decrypt text on any webpage via context menu

## Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your Chrome toolbar

## Usage

### Encrypting Text

1. Select any text on a webpage
2. Right-click and choose **"Encrypt"** from the context menu
3. Enter your encryption key when prompted
4. The selected text will be replaced with encrypted text

### Decrypting Text

1. Select encrypted text on a webpage
2. Right-click and choose **"Decrypt"** from the context menu
3. Enter the same encryption key used for encryption
4. The encrypted text will be replaced with the original text

### Changing the Encryption Key

1. Right-click anywhere on a webpage
2. Choose **"Change Key"** from the context menu
3. Enter a new encryption key
4. Choose whether to store it permanently or for the session only

## Security Features

- **PBKDF2 Key Derivation**: Uses 10,000 iterations for key strengthening
- **Random Salt**: Each encryption uses a unique random salt
- **Session Storage Option**: Choose to store keys only for the current session
- **No Blocking Prompts**: Custom Shadow DOM modal prevents UI blocking

## Technical Details

### Files

- `manifest.json`: Extension configuration (Manifest V3)
- `background.js`: Service worker for context menu and script injection
- `content.js`: Content script for encryption/decryption logic
- `crypto-js.min.js`: CryptoJS library for AES encryption
- `icon16.png`, `icon48.png`, `icon128.png`: Extension icons

### Encryption Algorithm

- **Algorithm**: AES (Advanced Encryption Standard)
- **Key Derivation**: PBKDF2 with 10,000 iterations
- **Key Size**: 256 bits
- **Mode**: CBC (Cipher Block Chaining)
- **Padding**: PKCS7

### Storage

- Keys can be stored in `chrome.storage.sync` (synced across devices)
- Session-only storage option available for temporary use

## Development

### Prerequisites

- Google Chrome browser
- Basic knowledge of JavaScript and Chrome Extension APIs

### Project Structure

```
plugin/
├── manifest.json          # Extension manifest
├── background.js          # Service worker
├── content.js            # Content script
├── crypto-js.min.js      # Encryption library
├── icon16.png            # 16x16 icon
├── icon48.png            # 48x48 icon
├── icon128.png           # 128x128 icon
└── README.md             # This file
```

### Making Changes

1. Edit the relevant files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## Version History

### v1.5 (Latest)
- Refactored to use dynamic script injection
- Replaced blocking `prompt()` with custom Shadow DOM modal
- Added session-only key storage option
- Updated icons to white outline style
- Improved performance by removing auto-injection

### v1.0
- Initial release
- Basic encrypt/decrypt functionality
- Context menu integration

## License

This project is open source and available for personal and educational use.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Note**: This extension is designed for educational purposes. For production use with sensitive data, please ensure you understand the security implications and consider additional security measures.
