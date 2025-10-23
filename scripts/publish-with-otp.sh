#!/bin/bash

# NPM Publication Script with OTP Support
# This script helps you publish with a one-time password

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 NPM Publication with OTP${NC}"
echo ""

# Check if logged in
if ! npm whoami >/dev/null 2>&1; then
    echo -e "${RED}❌ Not logged into npm. Run 'npm login' first.${NC}"
    exit 1
fi

# Get package info
PACKAGE_NAME=$(node -p "require('./package.json').name")
VERSION=$(node -p "require('./package.json').version")

echo -e "${GREEN}📋 Publishing: $PACKAGE_NAME@$VERSION${NC}"
echo ""

# Ask for OTP
echo -e "${YELLOW}🔐 NPM requires a one-time password (OTP) for publishing${NC}"
echo -e "${YELLOW}📱 Get your OTP code from your authenticator app${NC}"
echo ""
read -p "Enter your OTP code: " OTP_CODE

if [ -z "$OTP_CODE" ]; then
    echo -e "${RED}❌ OTP code is required${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}📤 Publishing to npm with OTP...${NC}"

# Publish with OTP
npm publish --otp=$OTP_CODE

echo ""
echo -e "${GREEN}✅ Published successfully!${NC}"
echo -e "${GREEN}🔗 Package URL: https://www.npmjs.com/package/$PACKAGE_NAME${NC}"
echo -e "${GREEN}📦 Install: npm install $PACKAGE_NAME${NC}"
