export interface ChangedFile {
  path: string
  status: string
}

export interface FileCategories {
  nonTestFiles: ChangedFile[]
  testFiles: ChangedFile[]
}