# Chrome Web Store Submission Checklist

## ✅ Completed Items

### Code & Files
- [x] Manifest V3 compliant
- [x] All permissions justified
- [x] LICENSE file (MIT)
- [x] PRIVACY.md (comprehensive privacy policy)
- [x] README.md (user documentation)
- [x] Clean distribution package (596KB)
- [x] Build script (build.sh)
- [x] Icons (16x16, 48x48, 128x128)

### Documentation
- [x] Store listing content (STORE_LISTING.md)
- [x] Privacy policy URL ready
- [x] Detailed description prepared
- [x] Short description (under 132 chars)
- [x] Permission justifications documented

### Assets
- [x] Promotional screenshots generated
- [x] Extension icons (white outline style)

## 📦 Distribution Package

**File**: `text-encrypt-decrypt-v1.5.zip`
**Size**: 596KB
**Location**: `/home/well/Downloads/chat/plugin/`

**Contents**:
- manifest.json
- background.js
- content.js
- crypto-js.min.js
- icon16.png, icon48.png, icon128.png
- README.md
- LICENSE
- PRIVACY.md

## 📋 Next Steps for Chrome Web Store Submission

### 1. Developer Account
- Go to https://chrome.google.com/webstore/devconsole
- Pay one-time $5 developer registration fee (if not already registered)

### 2. Upload Extension
- Click "New Item"
- Upload `text-encrypt-decrypt-v1.5.zip`
- Wait for automated checks to complete

### 3. Fill Store Listing

**Product Details**:
- **Name**: Text Encrypt/Decrypt
- **Summary**: Encrypt and decrypt text on any webpage using AES encryption. Secure your messages with a shared secret key.
- **Category**: Productivity
- **Language**: English

**Description**: (Copy from STORE_LISTING.md)

**Privacy**:
- **Privacy Policy URL**: https://github.com/valentinfomin/plugin/blob/main/PRIVACY.md
- **Single Purpose**: This extension encrypts and decrypts selected text on web pages using AES encryption.

**Permissions Justification**:
- contextMenus: Required to add encrypt/decrypt options to right-click menu
- activeTab: Needed to access selected text on the current page
- scripting: Required to inject encryption scripts dynamically
- storage: Stores user's encryption keys (with user consent)
- notifications: Displays success/error messages to user
- host_permissions (<all_urls>): Allows encryption on any website user visits

### 4. Upload Assets

**Screenshots** (from screenshots/ folder):
- screenshot1-context-menu.png
- screenshot2-key-modal.png

**Promotional Images** (optional but recommended):
- Small tile: 440x280 (can create if needed)
- Marquee: 1400x560 (can create if needed)

### 5. Submit for Review
- Review all information
- Click "Submit for Review"
- Wait 1-3 business days for review

## 🔍 Pre-Submission Testing

Before submitting, test the extension:

1. Load `dist/` folder in Chrome (chrome://extensions/)
2. Enable Developer Mode
3. Test all features:
   - Encrypt text
   - Decrypt text
   - Change key
   - Save key permanently
   - Session-only storage
4. Test on different websites
5. Verify icons display correctly

## 📝 Important Notes

- **Privacy Policy**: Must be accessible at the GitHub URL
- **Version**: Currently 1.5
- **Minimum Chrome Version**: 88 (for Manifest V3)
- **Review Time**: Typically 1-3 business days
- **Updates**: Can update extension anytime after approval

## 🎯 Post-Approval

After approval:
- Extension will be live on Chrome Web Store
- Users can install with one click
- You can track installs and reviews in developer console
- Can publish updates anytime (also subject to review)

---

**Ready to Submit!** 🚀

All required files are prepared and committed to GitHub. The distribution package is ready for upload.
