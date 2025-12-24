# AI Git Commit Tool

A Deno CLI tool that automates git commits with AI-generated commit messages, handling production and test files separately.

## Features

- 🤖 AI-generated commit messages using OpenAI
- 📝 Separates test files from production code
- 🔄 Two-stage commit process
- 📊 Clear visual feedback
- ⚡ Fast and lightweight

## Installation

1. Make sure you have [Deno](https://deno.land/) installed
2. Clone this repository
3. Run the installation script:

```bash
./install.sh
```

Or install manually:

```bash
deno install --allow-all --name commit main.ts
```

## Setup

Set your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY=your_api_key_here
```

Add this to your shell profile (`.bashrc`, `.zshrc`, etc.) to make it permanent.

## Usage

Navigate to any git repository and run:

```bash
commit
```

The tool will:

1. Detect all changed files
2. Separate test files from production code
3. Generate an AI commit message for production files
4. Create two commits:
   - First: Production files with AI-generated message
   - Second: Test files with "chore: test files for [feature]"

## Example Output

```bash
$ commit
🔍 Detecting changes...
Detected changes:
  📝 Non-test files:
    - src/payment.ts
    - src/utils/validator.ts
  🧪 Test files:
    - src/payment.test.ts
    - src/utils/validator.spec.ts

🤖 Generating commit message...
AI suggested: "feat: add payment validation with credit card support"

✅ Committed non-test files
✅ Committed test files

🎉 Done! Created commits successfully.
```

## Test File Patterns

The tool recognizes these patterns as test files:
- `*.test.ts`, `*.test.js`, `*.test.tsx`, `*.test.jsx`
- `*.spec.ts`, `*.spec.js`, `*.spec.tsx`, `*.spec.jsx`
- Files in `__tests__/` directories
- Files in `.test/` or `.spec/` directories

## Configuration

The tool uses OpenAI's GPT-3.5-turbo by default. You can modify the model in `src/git-commit-tool.ts`.

## Requirements

- Deno 1.37+
- Git repository
- OpenAI API key

## License

MIT