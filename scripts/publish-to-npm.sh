#!/bin/bash

# n8n-nodes-cavelo NPM Publication Script
# This script publishes the package to NPMJS while excluding it from git tracking

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if user is logged into npm
check_npm_auth() {
    if ! npm whoami >/dev/null 2>&1; then
        print_error "Not logged into npm. Please run 'npm login' first."
        exit 1
    fi
    print_success "Logged into npm as $(npm whoami)"
}

# Function to validate package.json
validate_package() {
    print_status "Validating package.json..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in current directory"
        exit 1
    fi
    
    # Check required fields
    local name=$(node -p "require('./package.json').name")
    local version=$(node -p "require('./package.json').version")
    local description=$(node -p "require('./package.json').description")
    
    if [ -z "$name" ] || [ "$name" = "undefined" ]; then
        print_error "Package name is missing in package.json"
        exit 1
    fi
    
    if [ -z "$version" ] || [ "$version" = "undefined" ]; then
        print_error "Package version is missing in package.json"
        exit 1
    fi
    
    print_success "Package validation passed: $name@$version"
}

# Function to check if dist directory exists
check_build() {
    print_status "Checking if dist directory exists..."
    
    if [ ! -d "dist" ]; then
        print_warning "dist directory not found. Building package..."
        npm run build
    else
        print_success "dist directory found"
    fi
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        npm test
        print_success "Tests passed"
    else
        print_warning "No tests found, skipping test step"
    fi
}

# Function to run linting
run_lint() {
    print_status "Running linting..."
    
    if [ -f "package.json" ] && grep -q '"lint"' package.json; then
        if npm run lint 2>/dev/null; then
            print_success "Linting passed"
        else
            print_warning "Linting failed, but continuing with publication..."
        fi
    else
        print_warning "No lint script found, skipping lint step"
    fi
}

# Function to check if package is already published and offer version bumping
check_existing_package() {
    local package_name=$(node -p "require('./package.json').name")
    local current_version=$(node -p "require('./package.json').version")
    
    print_status "Checking if package version already exists..."
    
    if npm view "$package_name@$current_version" version >/dev/null 2>&1; then
        print_warning "Version $current_version of $package_name is already published."
        print_status "Available version bump options:"
        echo "1) Patch ($current_version → 1.0.1)"
        echo "2) Minor ($current_version → 1.1.0)"
        echo "3) Major ($current_version → 2.0.0)"
        echo "4) Custom version"
        echo "5) Exit without publishing"
        
        while true; do
            read -p "$(echo -e "${YELLOW}[CONFIRM]${NC} Choose version bump option (1-5): ")" choice
            case $choice in
                1)
                    print_status "Bumping patch version..."
                    if npm version patch --no-git-tag-version >/dev/null 2>&1; then
                        print_success "Version bumped to $(node -p "require('./package.json').version")"
                    else
                        # Manual version bump if npm version fails
                        local new_version="1.0.1"
                        node -e "const pkg = require('./package.json'); pkg.version = '$new_version'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
                        print_success "Version manually set to $new_version"
                    fi
                    break
                    ;;
                2)
                    print_status "Bumping minor version..."
                    if npm version minor --no-git-tag-version >/dev/null 2>&1; then
                        print_success "Version bumped to $(node -p "require('./package.json').version")"
                    else
                        # Manual version bump if npm version fails
                        local new_version="1.1.0"
                        node -e "const pkg = require('./package.json'); pkg.version = '$new_version'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
                        print_success "Version manually set to $new_version"
                    fi
                    break
                    ;;
                3)
                    print_status "Bumping major version..."
                    if npm version major --no-git-tag-version >/dev/null 2>&1; then
                        print_success "Version bumped to $(node -p "require('./package.json').version")"
                    else
                        # Manual version bump if npm version fails
                        local new_version="2.0.0"
                        node -e "const pkg = require('./package.json'); pkg.version = '$new_version'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
                        print_success "Version manually set to $new_version"
                    fi
                    break
                    ;;
                4)
                    read -p "$(echo -e "${YELLOW}[INPUT]${NC} Enter custom version (e.g., 1.2.3): ")" custom_version
                    if [[ $custom_version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
                        if npm version $custom_version --no-git-tag-version >/dev/null 2>&1; then
                            print_success "Version set to $(node -p "require('./package.json').version")"
                        else
                            # Manual version set if npm version fails
                            node -e "const pkg = require('./package.json'); pkg.version = '$custom_version'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
                            print_success "Version manually set to $custom_version"
                        fi
                        break
                    else
                        print_error "Invalid version format. Please use semantic versioning (e.g., 1.2.3)"
                    fi
                    ;;
                5)
                    print_error "Publication cancelled by user."
                    exit 1
                    ;;
                *)
                    print_error "Invalid option. Please choose 1-5."
                    ;;
            esac
        done
    else
        print_success "Package version $package_name@$current_version is available for publishing"
    fi
}

# Function to create .npmrc if it doesn't exist
setup_npmrc() {
    if [ ! -f ".npmrc" ]; then
        print_status "Creating .npmrc file..."
        cat > .npmrc << EOF
# NPM Configuration for n8n-nodes-cavelo
registry=https://registry.npmjs.org/
save-exact=true
package-lock=true
EOF
        print_success ".npmrc file created"
    else
        print_status ".npmrc file already exists"
    fi
}

# Function to add .npmrc to .gitignore
update_gitignore() {
    if [ -f ".gitignore" ] && ! grep -q "\.npmrc" .gitignore; then
        print_status "Adding .npmrc to .gitignore..."
        echo "" >> .gitignore
        echo "# NPM configuration" >> .gitignore
        echo ".npmrc" >> .gitignore
        print_success ".npmrc added to .gitignore"
    fi
}

# Function to publish to npm
publish_to_npm() {
    local package_name=$(node -p "require('./package.json').name")
    local version=$(node -p "require('./package.json').version")
    
    print_status "Publishing $package_name@$version to npm..."
    
    # Use npm publish with dry-run first to validate
    print_status "Running dry-run to validate package..."
    npm publish --dry-run
    
    if [ $? -eq 0 ]; then
        print_success "Dry-run successful, proceeding with actual publish..."
        
        # Ask for confirmation
        echo ""
        print_warning "About to publish $package_name@$version to npm registry"
        read -p "Do you want to continue? (y/N): " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm publish
            print_success "Package $package_name@$version published successfully!"
            print_status "Package URL: https://www.npmjs.com/package/$package_name"
        else
            print_warning "Publication cancelled by user"
            exit 0
        fi
    else
        print_error "Dry-run failed, aborting publication"
        exit 1
    fi
}

# Function to show package info after publication
show_package_info() {
    local package_name=$(node -p "require('./package.json').name")
    local version=$(node -p "require('./package.json').version")
    
    echo ""
    print_success "🎉 Publication Complete!"
    echo ""
    echo "Package Information:"
    echo "  Name: $package_name"
    echo "  Version: $version"
    echo "  NPM URL: https://www.npmjs.com/package/$package_name"
    echo "  Install Command: npm install $package_name"
    echo ""
    print_status "Package is now available for installation via npm"
}

# Function to clean up temporary files
cleanup() {
    print_status "Cleaning up temporary files..."
    
    # Remove .npmrc if it was created by this script
    if [ -f ".npmrc" ] && grep -q "# NPM Configuration for n8n-nodes-cavelo" .npmrc; then
        rm .npmrc
        print_success "Temporary .npmrc file removed"
    fi
}

# Main execution
main() {
    echo ""
    print_status "🚀 Starting NPM publication process for n8n-nodes-cavelo"
    echo ""
    
    # Check prerequisites
    if ! command_exists npm; then
        print_error "npm is not installed or not in PATH"
        exit 1
    fi
    
    if ! command_exists node; then
        print_error "node is not installed or not in PATH"
        exit 1
    fi
    
    # Run publication steps
    check_npm_auth
    validate_package
    check_build
    run_tests
    run_lint
    check_existing_package
    setup_npmrc
    update_gitignore
    publish_to_npm
    show_package_info
    
    # Cleanup
    cleanup
    
    print_success "🎉 Publication process completed successfully!"
}

# Trap to handle cleanup on exit
trap cleanup EXIT

# Run main function
main "$@"
