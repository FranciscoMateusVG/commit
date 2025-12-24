import type { ChangedFile } from './types.ts'

export class GitOperations {
  async getChangedFiles(): Promise<ChangedFile[]> {
    const command = new Deno.Command('git', {
      args: ['ls-files', '--others', '--modified', '--exclude-standard'],
      stdout: 'piped',
      stderr: 'piped'
    })

    const { code, stdout, stderr } = await command.output()

    if (code !== 0) {
      const errorText = new TextDecoder().decode(stderr)
      throw new Error(`Failed to get git status: ${errorText}`)
    }

    const output = new TextDecoder().decode(stdout)
    const files = output
      .trim()
      .split('\n')
      .filter((line) => line.length > 0)

    return files.map((path) => ({
      status: '??',
      path: path
    }))
  }

  async getDiffs(files: ChangedFile[]): Promise<string> {
    const diffs: string[] = []

    for (const file of files) {
      try {
        const statusCommand = new Deno.Command('git', {
          args: ['ls-files', '--error-unmatch', file.path],
          stdout: 'piped',
          stderr: 'piped'
        })

        const { code: statusCode } = await statusCommand.output()
        
        if (statusCode === 0) {
          const command = new Deno.Command('git', {
            args: ['diff', 'HEAD', '--', file.path],
            stdout: 'piped',
            stderr: 'piped'
          })

          const { code, stdout } = await command.output()
          if (code === 0) {
            const diff = new TextDecoder().decode(stdout)
            if (diff.trim()) {
              diffs.push(`File: ${file.path}\n${diff}`)
            }
          }
        } else {
          const content = await Deno.readTextFile(file.path)
          if (content.trim()) {
            diffs.push(`New file: ${file.path}\n+++ ${file.path}\n${content.split('\n').map(line => `+${line}`).join('\n')}`)
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not get diff for ${file.path}`)
      }
    }

    return diffs.join('\n\n')
  }

  async commitFiles(files: ChangedFile[], message: string): Promise<void> {
    const filePaths = files.map((f) => f.path)

    const addCommand = new Deno.Command('git', {
      args: ['add', ...filePaths],
      stdout: 'piped',
      stderr: 'piped'
    })

    const { code: addCode, stderr: addStderr } = await addCommand.output()

    if (addCode !== 0) {
      const errorText = new TextDecoder().decode(addStderr)
      throw new Error(`Failed to stage files: ${errorText}`)
    }

    const commitCommand = new Deno.Command('git', {
      args: ['commit', '-m', message],
      stdout: 'piped',
      stderr: 'piped'
    })

    const { code: commitCode, stderr: commitStderr } = await commitCommand.output()

    if (commitCode !== 0) {
      const errorText = new TextDecoder().decode(commitStderr)
      throw new Error(`Failed to commit: ${errorText}`)
    }
  }
}