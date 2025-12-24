#!/bin/bash

echo "🚀 Installing commit CLI tool..."

if ! command -v deno &> /dev/null; then
    echo "❌ Deno is not installed. Please install Deno first: https://deno.land/manual/getting_started/installation"
    exit 1
fi

deno install --allow-all --name commit --force main.ts

echo "✅ Installation complete!"
echo ""
echo "Usage:"
echo "  commit    # Run in any git repository to auto-commit changes"
echo ""
echo "Make sure to set your OPENAI_API_KEY environment variable:"
echo "  export OPENAI_API_KEY=your_api_key_here"