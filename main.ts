#!/usr/bin/env -S deno run --allow-all

import 'jsr:@std/dotenv/load'
import { GitCommitTool } from './src/git-commit-tool.ts'

function showHelp() {
  console.log(`commit - AI-powered Git commit tool

Usage:
  commit              Generate and create commits for changes
  commit --setup      One-liner setup for API key
  commit --check      Check configuration and environment
  commit --help       Show this help message

Environment Variables:
  OPENAI_API_KEY      Required: Your OpenAI API key
  DEBUG               Optional: Set to 'true' for debug output

Examples:
  commit --setup      # Interactive setup
  commit              # Use after setup
  
  OPENAI_API_KEY="your-key" commit  # Direct usage
`)
}

function checkConfiguration() {
  console.log('🔧 Checking configuration...\n')
  
  const apiKey = Deno.env.get('OPENAI_API_KEY')
  if (apiKey) {
    console.log('✅ OPENAI_API_KEY is set')
  } else {
    console.log('❌ OPENAI_API_KEY is not set')
    console.log('\nTo fix this:')
    console.log('1. Get your API key from: https://platform.openai.com/api-keys')
    console.log('2. Add it to your shell profile (~/.bashrc, ~/.zshrc, ~/.profile):')
    console.log('   export OPENAI_API_KEY="your-api-key-here"')
    console.log('3. Reload your shell: source ~/.zshrc (or restart terminal)')
    console.log('4. Verify with: echo $OPENAI_API_KEY')
    return false
  }
  
  const debug = Deno.env.get('DEBUG')
  if (debug === 'true') {
    console.log('🐛 DEBUG mode is enabled')
  } else {
    console.log('ℹ️  DEBUG mode is disabled (set DEBUG=true to enable)')
  }
  
  console.log('\n✅ Configuration looks good!')
  return true
}

async function setupApiKey() {
  console.log('🔧 Setting up OpenAI API Key...\n')
  
  // Prompt for API key
  console.log('Please paste your OpenAI API key:')
  console.log('(Get one from: https://platform.openai.com/api-keys)')
  console.log('')
  
  const decoder = new TextDecoder()
  const buffer = new Uint8Array(1024)
  await Deno.stdin.read(buffer)
  const apiKey = decoder.decode(buffer).trim().replace(/\0/g, '')
  
  if (!apiKey || apiKey.length < 10) {
    console.log('❌ Invalid API key provided')
    return false
  }
  
  // Detect shell and profile file
  const shell = Deno.env.get('SHELL') || '/bin/bash'
  const home = Deno.env.get('HOME')
  
  if (!home) {
    console.log('❌ Could not detect home directory')
    return false
  }
  
  let profileFile = ''
  if (shell.includes('zsh')) {
    profileFile = `${home}/.zshrc`
  } else if (shell.includes('bash')) {
    profileFile = `${home}/.bashrc`
  } else {
    profileFile = `${home}/.profile`
  }
  
  try {
    // Check if API key already exists in profile
    let content = ''
    try {
      content = await Deno.readTextFile(profileFile)
    } catch {
      // File doesn't exist, that's ok
    }
    
    if (content.includes('OPENAI_API_KEY')) {
      console.log('⚠️  OPENAI_API_KEY already exists in your profile')
      console.log('Do you want to update it? (y/N): ')
      
      const confirmBuffer = new Uint8Array(10)
      await Deno.stdin.read(confirmBuffer)
      const confirm = decoder.decode(confirmBuffer).trim().toLowerCase()
      
      if (confirm !== 'y' && confirm !== 'yes') {
        console.log('❌ Setup cancelled')
        return false
      }
      
      // Remove existing OPENAI_API_KEY lines
      content = content.split('\n')
        .filter(line => !line.includes('OPENAI_API_KEY'))
        .join('\n')
    }
    
    // Add the API key
    const exportLine = `export OPENAI_API_KEY="${apiKey}"`
    const newContent = content + (content.endsWith('\n') ? '' : '\n') + exportLine + '\n'
    
    await Deno.writeTextFile(profileFile, newContent)
    
    console.log(`✅ API key added to ${profileFile}`)
    console.log('\nTo activate the changes:')
    console.log(`  source ${profileFile}`)
    console.log('Or restart your terminal')
    console.log('\nThen run: commit --check')
    
    return true
    
  } catch (error) {
    console.log(`❌ Failed to write to ${profileFile}:`, error)
    console.log('\nManual setup:')
    console.log(`Add this line to your ${profileFile}:`)
    console.log(`export OPENAI_API_KEY="${apiKey}"`)
    return false
  }
}

async function main() {
  const args = Deno.args
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp()
    return
  }
  
  if (args.includes('--check')) {
    checkConfiguration()
    return
  }
  
  if (args.includes('--setup')) {
    await setupApiKey()
    return
  }
  
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
