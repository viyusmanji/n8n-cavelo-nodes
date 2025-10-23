#!/bin/bash

# Simple NPM Publication Script
# Run this with your OTP code

set -e

echo "🚀 Publishing n8n-nodes-cavelo to NPMJS"
echo ""

# Get OTP from user
read -p "Enter your OTP code from authenticator: " OTP_CODE

if [ -z "$OTP_CODE" ]; then
    echo "❌ OTP code is required"
    exit 1
fi

echo ""
echo "📤 Publishing with OTP..."

# Publish with OTP
npm publish --otp=$OTP_CODE

echo ""
echo "✅ Published successfully!"
echo "🔗 Package URL: https://www.npmjs.com/package/n8n-nodes-cavelo"
echo "📦 Install: npm install n8n-nodes-cavelo"
