import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import type { ChangedFile } from './types.ts'

export class AIIntegration {
  private debug = Deno.env.get('DEBUG') === 'true'

  async generateCommitMessage(files: ChangedFile[], diffs: string): Promise<string> {
    const apiKey = Deno.env.get('OPENAI_API_KEY')

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required')
    }

    const model = openai('gpt-4o-mini')

    const prompt = `Analyze these git diffs and generate a conventional commit message. Use format: type: description

Rules:
- Use conventional commit types: feat, fix, refactor, docs, style, test, chore
- Keep description concise and clear
- Focus on what changed and why
- Use present tense

Diffs:
${diffs}

Generate only the commit message, nothing else:`

    if (this.debug) {
      console.log('\n🐛 DEBUG: AI Prompt:')
      console.log('=' .repeat(50))
      console.log(prompt)
      console.log('=' .repeat(50))
    }

    const { text } = await generateText({
      model,
      prompt
    })

    return text.trim()
  }

  generateTestCommitMessage(originalMessage: string): string {
    const featureName = this.extractFeatureName(originalMessage)
    return `chore: test files for ${featureName}`
  }

  private extractFeatureName(commitMessage: string): string {
    const match = commitMessage.match(/^[a-z]+:\s*(.+)$/i)
    return match ? match[1] : 'recent changes'
  }
}