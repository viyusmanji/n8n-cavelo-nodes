#!/bin/bash

# Quick NPM Publication Script for n8n-nodes-cavelo
# Simplified version for quick publishing

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Quick NPM Publication${NC}"
echo ""

# Check if logged in
if ! npm whoami >/dev/null 2>&1; then
    echo -e "${RED}❌ Not logged into npm. Run 'npm login' first.${NC}"
    exit 1
fi

# Build if needed
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}📦 Building package...${NC}"
    npm run build
fi

# Get package info
PACKAGE_NAME=$(node -p "require('./package.json').name")
VERSION=$(node -p "require('./package.json').version")

echo -e "${GREEN}📋 Publishing: $PACKAGE_NAME@$VERSION${NC}"

# Dry run first
echo -e "${YELLOW}🔍 Running dry-run...${NC}"
npm publish --dry-run

# Confirm publication
echo ""
read -p "Continue with actual publish? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}📤 Publishing to npm...${NC}"
    npm publish
    
    echo ""
    echo -e "${GREEN}✅ Published successfully!${NC}"
    echo -e "${GREEN}🔗 Package URL: https://www.npmjs.com/package/$PACKAGE_NAME${NC}"
    echo -e "${GREEN}📦 Install: npm install $PACKAGE_NAME${NC}"
else
    echo -e "${YELLOW}❌ Publication cancelled${NC}"
fi
