#!/bin/bash

# Chrome Web Store Package Builder
# This script creates a clean distribution package for Chrome Web Store submission

echo "Building Chrome Web Store package..."

# Create distribution directory
mkdir -p dist
rm -rf dist/*

# Copy essential files only
cp manifest.json dist/
cp background.js dist/
cp content.js dist/
cp crypto-js.min.js dist/
cp icon16.png dist/
cp icon48.png dist/
cp icon128.png dist/
cp README.md dist/
cp LICENSE dist/
cp PRIVACY.md dist/

# Create zip file
cd dist
zip -r ../text-encrypt-decrypt-v1.5.zip .
cd ..

echo "✅ Package created: text-encrypt-decrypt-v1.5.zip"
echo ""
echo "Files included:"
ls -lh dist/
echo ""
echo "Package size:"
ls -lh text-encrypt-decrypt-v1.5.zip
echo ""
echo "Next steps:"
echo "1. Test the extension by loading the 'dist' folder in Chrome"
echo "2. Upload text-encrypt-decrypt-v1.5.zip to Chrome Web Store"
echo "3. Fill in the store listing using STORE_LISTING.md as reference"
