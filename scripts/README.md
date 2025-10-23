# NPM Publication Scripts

This directory contains scripts to safely publish the n8n-nodes-cavelo package to NPMJS while excluding it from git tracking.

## 📋 Available Scripts

### 1. **Full Publication Script** (`publish-to-npm.sh`)
Comprehensive script with full validation and safety checks.

**Features:**
- ✅ NPM authentication check
- ✅ Package validation
- ✅ Build verification
- ✅ Test execution
- ✅ Linting checks
- ✅ Version conflict detection
- ✅ Dry-run validation
- ✅ User confirmation
- ✅ Cleanup on exit

**Usage:**
```bash
./scripts/publish-to-npm.sh
```

### 2. **Quick Publication Script** (`quick-publish.sh`)
Simplified script for quick publishing when you're confident about the package.

**Features:**
- ✅ Basic authentication check
- ✅ Build if needed
- ✅ Dry-run validation
- ✅ User confirmation
- ✅ Quick publication

**Usage:**
```bash
./scripts/quick-publish.sh
```

## 🚀 Pre-Publication Checklist

Before running either script, ensure:

### **Prerequisites**
- [ ] Node.js and npm installed
- [ ] Logged into npm (`npm login`)
- [ ] Package built (`npm run build`)
- [ ] Tests passing (`npm test`)
- [ ] Linting clean (`npm run lint`)

### **Package Configuration**
- [ ] `package.json` has correct name and version
- [ ] `package.json` has proper description and keywords
- [ ] `package.json` has correct repository URL
- [ ] `package.json` has proper author information
- [ ] `.npmignore` is configured correctly

### **Git Configuration**
- [ ] `.gitignore` excludes `.npmrc`
- [ ] All changes committed to git
- [ ] No uncommitted changes

## 📦 Publication Process

### **Step 1: Prepare Package**
```bash
# Ensure you're in the project root
cd /path/to/n8n-cavelo-nodes

# Build the package
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

### **Step 2: Login to NPM**
```bash
# Login to npm (if not already logged in)
npm login

# Verify login
npm whoami
```

### **Step 3: Choose Publication Method**

#### **Option A: Full Validation (Recommended)**
```bash
./scripts/publish-to-npm.sh
```

#### **Option B: Quick Publication**
```bash
./scripts/quick-publish.sh
```

### **Step 4: Verify Publication**
```bash
# Check package on npm
npm view n8n-nodes-cavelo

# Test installation
npm install n8n-nodes-cavelo
```

## 🔧 Script Features

### **Safety Features**
- **Dry-run validation**: Always runs `npm publish --dry-run` first
- **Version conflict detection**: Checks if version already exists
- **User confirmation**: Requires explicit confirmation before publishing
- **Error handling**: Exits on any error with clear messages
- **Cleanup**: Removes temporary files on exit

### **Validation Checks**
- **Authentication**: Verifies npm login status
- **Package structure**: Validates package.json and dist directory
- **Build verification**: Ensures dist directory exists
- **Test execution**: Runs tests if available
- **Linting**: Runs linting if available

### **User Experience**
- **Colored output**: Clear status messages with colors
- **Progress indication**: Shows current step in process
- **Error messages**: Clear error descriptions
- **Success confirmation**: Shows package URL and install command

## 🛠️ Troubleshooting

### **Common Issues**

#### **"Not logged into npm"**
```bash
npm login
```

#### **"Package already exists"**
Update version in `package.json`:
```bash
npm version patch  # or minor, major
```

#### **"dist directory not found"**
Build the package:
```bash
npm run build
```

#### **"Tests failing"**
Fix tests or skip with quick script:
```bash
./scripts/quick-publish.sh
```

#### **"Linting errors"**
Fix linting issues:
```bash
npm run lintfix
```

### **Script Permissions**
If scripts are not executable:
```bash
chmod +x scripts/*.sh
```

### **NPM Authentication Issues**
```bash
# Check current user
npm whoami

# Re-login if needed
npm logout
npm login
```

## 📊 Post-Publication

### **Verify Publication**
1. **Check NPMJS**: Visit https://www.npmjs.com/package/n8n-nodes-cavelo
2. **Test Installation**: `npm install n8n-nodes-cavelo`
3. **Verify Package**: `npm list n8n-nodes-cavelo`

### **Update Documentation**
- Update README with installation command
- Update changelog with new version
- Update any version references

### **Git Management**
- Commit any changes made by scripts
- Tag the release: `git tag v1.0.0`
- Push tags: `git push --tags`

## 🔒 Security Notes

### **NPM Credentials**
- Scripts do NOT store or transmit credentials
- Uses existing npm authentication
- No sensitive data in scripts

### **Git Exclusion**
- `.npmrc` is added to `.gitignore`
- No npm credentials committed to git
- Safe for public repositories

### **Package Security**
- Only publishes files specified in `package.json` files array
- Excludes source files via `.npmignore`
- Excludes workflows directory
- Excludes test files and documentation

## 📝 Script Output Examples

### **Successful Publication**
```
🚀 Starting NPM publication process for n8n-nodes-cavelo

[INFO] Logged into npm as sullyman
[SUCCESS] Package validation passed: n8n-nodes-cavelo@1.0.0
[SUCCESS] dist directory found
[SUCCESS] Tests passed
[SUCCESS] Linting passed
[SUCCESS] Package version n8n-nodes-cavelo@1.0.0 is available for publishing
[INFO] Running dry-run to validate package...
[SUCCESS] Dry-run successful, proceeding with actual publish...

About to publish n8n-nodes-cavelo@1.0.0 to npm registry
Do you want to continue? (y/N): y
[SUCCESS] Package n8n-nodes-cavelo@1.0.0 published successfully!

🎉 Publication Complete!

Package Information:
  Name: n8n-nodes-cavelo
  Version: 1.0.0
  NPM URL: https://www.npmjs.com/package/n8n-nodes-cavelo
  Install Command: npm install n8n-nodes-cavelo

[SUCCESS] 🎉 Publication process completed successfully!
```

## 🎯 Best Practices

1. **Always use dry-run first**: Scripts automatically do this
2. **Test locally**: Ensure package works before publishing
3. **Version management**: Use semantic versioning
4. **Documentation**: Keep README and docs updated
5. **Git hygiene**: Commit changes before publishing
6. **Security**: Never commit npm credentials

---

**Ready to publish?** Run `./scripts/publish-to-npm.sh` for the full experience or `./scripts/quick-publish.sh` for quick publishing!
