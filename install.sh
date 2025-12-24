#!/bin/bash

# Install script for commit CLI tool

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if deno is installed
if ! command -v deno &> /dev/null; then
    echo -e "${RED}❌ Deno is not installed. Please install Deno first: https://deno.land/manual/getting_started/installation${NC}"
    exit 1
fi

echo -e "${YELLOW}🔨 Building commit binary...${NC}"

# Create dist directory
mkdir -p dist

# Compile the binary
if deno compile --allow-all --output ./dist/commit main.ts; then
    echo -e "${GREEN}✅ Binary built successfully${NC}"
else
    echo -e "${RED}❌ Failed to build binary${NC}"
    exit 1
fi

# Determine installation method
if [[ "$1" == "--global" ]]; then
    # Global installation (requires sudo)
    echo -e "${YELLOW}📦 Installing globally (requires sudo)...${NC}"
    if sudo cp ./dist/commit /usr/local/bin/commit && sudo chmod +x /usr/local/bin/commit; then
        echo -e "${GREEN}✅ commit installed globally to /usr/local/bin/commit${NC}"
    else
        echo -e "${RED}❌ Failed to install globally${NC}"
        exit 1
    fi
else
    # User-local installation
    echo -e "${YELLOW}📦 Installing to ~/.local/bin...${NC}"
    mkdir -p ~/.local/bin
    
    if cp ./dist/commit ~/.local/bin/commit && chmod +x ~/.local/bin/commit; then
        echo -e "${GREEN}✅ commit installed to ~/.local/bin/commit${NC}"
        
        # Check if ~/.local/bin is in PATH
        if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
            echo -e "${YELLOW}⚠️  ~/.local/bin is not in your PATH${NC}"
            echo -e "${YELLOW}   Add this line to your shell profile (.bashrc, .zshrc, etc.):${NC}"
            echo -e "${YELLOW}   export PATH=\"\$HOME/.local/bin:\$PATH\"${NC}"
        fi
    else
        echo -e "${RED}❌ Failed to install locally${NC}"
        exit 1
    fi
fi

# Test the installation
echo -e "${YELLOW}🧪 Testing installation...${NC}"
if ~/.local/bin/commit --help &> /dev/null || /usr/local/bin/commit --help &> /dev/null; then
    echo -e "${GREEN}✅ Installation successful! You can now use 'commit' command${NC}"
else
    echo -e "${YELLOW}⚠️  Installation completed but command test failed. You may need to restart your shell.${NC}"
fi

# Environment variables note
echo -e "${YELLOW}📝 Note: Make sure your environment variables (like OPENAI_API_KEY) are available in your shell profile${NC}"