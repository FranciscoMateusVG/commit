import type { ChangedFile, FileCategories } from './types.ts'

export class FileCategorizer {
  private testFilePatterns = [
    /\.test\.(ts|js|tsx|jsx)$/,
    /\.spec\.(ts|js|tsx|jsx)$/,
    /__tests__\//,
    /\.test\//,
    /\.spec\//
  ]

  categorizeFiles(files: ChangedFile[]): FileCategories {
    const nonTestFiles: ChangedFile[] = []
    const testFiles: ChangedFile[] = []

    for (const file of files) {
      if (this.isTestFile(file.path)) {
        testFiles.push(file)
      } else {
        nonTestFiles.push(file)
      }
    }

    return { nonTestFiles, testFiles }
  }

  private isTestFile(filePath: string): boolean {
    return this.testFilePatterns.some((pattern) => pattern.test(filePath))
  }
}