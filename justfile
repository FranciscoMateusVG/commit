# Justfile for commit CLI tool

# Default recipe
default: build

# Build the binary
build:
    deno compile --allow-all --output ./dist/commit main.ts

# Install the binary to user's bin directory
install: build
    mkdir -p ~/.local/bin
    cp ./dist/commit ~/.local/bin/commit
    chmod +x ~/.local/bin/commit
    @echo "✅ commit installed to ~/.local/bin/commit"
    @echo "Make sure ~/.local/bin is in your PATH"

# Install globally (requires sudo)
install-global: build
    sudo cp ./dist/commit /usr/local/bin/commit
    sudo chmod +x /usr/local/bin/commit
    @echo "✅ commit installed globally to /usr/local/bin/commit"

# Clean build artifacts
clean:
    rm -rf ./dist

# Development run
dev:
    deno run --allow-all main.ts

# Run tests
test:
    deno test --allow-all

# Check formatting and linting
check:
    deno fmt --check
    deno lint