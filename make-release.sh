#!/bin/bash

# Release packaging script for no-db-office-chat
# Creates a distributable ZIP file excluding development files

VERSION="v1"
RELEASE_NAME="no-db-office-chat-${VERSION}.zip"

echo "Creating release package: ${RELEASE_NAME}"

# Create temporary directory for clean packaging
TEMP_DIR="temp_release"
rm -rf "${TEMP_DIR}"
mkdir -p "${TEMP_DIR}/no-db-office-chat"

# Copy relevant files (exclude node_modules, .git, etc.)
echo "Copying files..."

cp -r public "${TEMP_DIR}/no-db-office-chat/"
cp -r docker "${TEMP_DIR}/no-db-office-chat/"
cp -r deploy "${TEMP_DIR}/no-db-office-chat/"
cp -r test "${TEMP_DIR}/no-db-office-chat/"

cp server.js "${TEMP_DIR}/no-db-office-chat/"
cp package.json "${TEMP_DIR}/no-db-office-chat/"
cp .gitignore "${TEMP_DIR}/no-db-office-chat/"
cp .eslintrc.json "${TEMP_DIR}/no-db-office-chat/"
cp .prettierrc "${TEMP_DIR}/no-db-office-chat/"
cp README.md "${TEMP_DIR}/no-db-office-chat/"
cp LICENSE "${TEMP_DIR}/no-db-office-chat/"
cp CHANGELOG.md "${TEMP_DIR}/no-db-office-chat/"

# Create ZIP file
echo "Creating ZIP archive..."
cd "${TEMP_DIR}"
zip -r "../${RELEASE_NAME}" no-db-office-chat/
cd ..

# Cleanup
rm -rf "${TEMP_DIR}"

echo "Release package created: ${RELEASE_NAME}"
echo "Size: $(du -h ${RELEASE_NAME} | cut -f1)"
