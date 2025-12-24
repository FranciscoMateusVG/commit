import type { ChangedFile } from './types.ts'

export class UserInterface {
  displayDetectedChanges(nonTestFiles: ChangedFile[], testFiles: ChangedFile[]): void {
    console.log('Detected changes:')

    if (nonTestFiles.length > 0) {
      console.log('  📝 Non-test files:')
      nonTestFiles.forEach((file) => {
        console.log(`    - ${file.path}`)
      })
    }

    if (testFiles.length > 0) {
      console.log('  🧪 Test files:')
      testFiles.forEach((file) => {
        console.log(`    - ${file.path}`)
      })
    }
  }

  async showCommitSummary(
    nonTestFiles: ChangedFile[],
    testFiles: ChangedFile[],
    commitMessage: string,
    testCommitMessage: string
  ): Promise<void> {
    console.log('\n📋 Commit Summary:')
    console.log('═'.repeat(50))

    if (nonTestFiles.length > 0) {
      console.log(`\n📦 First commit (${nonTestFiles.length} files):`)
      console.log(`   Message: "${commitMessage}"`)
      console.log('   Files:')
      nonTestFiles.forEach((file) => {
        console.log(`     - ${file.path}`)
      })
    }

    if (testFiles.length > 0) {
      console.log(`\n🧪 Second commit (${testFiles.length} files):`)
      console.log(`   Message: "${testCommitMessage}"`)
      console.log('   Files:')
      testFiles.forEach((file) => {
        console.log(`     - ${file.path}`)
      })
    }
  }

  async askForConfirmation(): Promise<boolean> {
    console.log('\n❓ Do you want to proceed with these commits? (y/N)')

    const buf = new Uint8Array(1024)
    const n = (await Deno.stdin.read(buf)) ?? 0
    const answer = new TextDecoder()
      .decode(buf.subarray(0, n))
      .trim()
      .toLowerCase()

    return answer === 'y' || answer === 'yes'
  }
}