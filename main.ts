#!/usr/bin/env -S deno run --allow-all

import 'jsr:@std/dotenv/load'
import { GitCommitTool } from './src/git-commit-tool.ts'
async function main() {
  try {
    const tool = new GitCommitTool()
    await tool.run()
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Error:', error.message)
    } else {
      console.error('❌ Error:', error)
    }
    Deno.exit(1)
  }
}

if (import.meta.main) {
  await main()
}
