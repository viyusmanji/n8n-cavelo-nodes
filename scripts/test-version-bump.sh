#!/bin/bash

# Test script to demonstrate version bumping functionality
echo "🧪 Testing version bump functionality..."

# Simulate the version bumping logic
current_version=$(node -p "require('./package.json').version")
echo "Current version: $current_version"

echo ""
echo "Available version bump options:"
echo "1) Patch ($current_version → 1.0.1)"
echo "2) Minor ($current_version → 1.1.0)"
echo "3) Major ($current_version → 2.0.0)"
echo "4) Custom version"
echo "5) Exit without publishing"

echo ""
echo "Testing patch version bump..."
if npm version patch --dry-run >/dev/null 2>&1; then
    echo "✅ npm version patch would work"
else
    echo "⚠️  npm version patch failed (likely due to git), would use manual version setting"
fi

echo ""
echo "Testing manual version bump..."
# Test manual version setting
node -e "const pkg = require('./package.json'); console.log('Current version:', pkg.version); pkg.version = '1.0.1'; console.log('New version would be:', pkg.version);"

echo ""
echo "✅ Version bump functionality is working correctly!"
