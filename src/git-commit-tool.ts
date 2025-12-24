import { AIIntegration } from './ai-integration.ts'
import { FileCategorizer } from './file-categorizer.ts'
import { GitOperations } from './git-operations.ts'
import { UserInterface } from './user-interface.ts'

export class GitCommitTool {
  private gitOps = new GitOperations()
  private fileCategorizer = new FileCategorizer()
  private aiIntegration = new AIIntegration()
  private ui = new UserInterface()

  async run(): Promise<void> {
    console.log('🔍 Detecting changes...')

    const changedFiles = await this.gitOps.getChangedFiles()
    if (changedFiles.length === 0) {
      console.log('✅ No changes detected. Working directory is clean.')
      return
    }

    const { nonTestFiles, testFiles } =
      this.fileCategorizer.categorizeFiles(changedFiles)

    this.ui.displayDetectedChanges(nonTestFiles, testFiles)

    if (nonTestFiles.length === 0 && testFiles.length === 0) {
      console.log('✅ No files to commit.')
      return
    }

    let commitMessage = ''

    if (nonTestFiles.length > 0) {
      console.log('\n🤖 Generating commit message...')
      const diffs = await this.gitOps.getDiffs(nonTestFiles)
      commitMessage = await this.aiIntegration.generateCommitMessage(
        nonTestFiles,
        diffs
      )
      console.log(`AI suggested: "${commitMessage}"`)
    }

    let testCommitMessage = ''
    if (testFiles.length > 0) {
      testCommitMessage =
        this.aiIntegration.generateTestCommitMessage(commitMessage)
    }

    await this.ui.showCommitSummary(
      nonTestFiles,
      testFiles,
      commitMessage,
      testCommitMessage
    )

    const shouldProceed = await this.ui.askForConfirmation()
    if (!shouldProceed) {
      console.log('❌ Commit cancelled by user.')
      return
    }

    if (nonTestFiles.length > 0) {
      await this.gitOps.commitFiles(nonTestFiles, commitMessage)
      console.log('✅ Committed non-test files')
    }

    if (testFiles.length > 0) {
      await this.gitOps.commitFiles(testFiles, testCommitMessage)
      console.log('✅ Committed test files')
    }

    console.log('\n🎉 Done! Created commits successfully.')
  }
}
