import { GitCommitTool } from './src/git-commit-tool.ts';

Deno.test('GitCommitTool should initialize without errors', () => {
  const tool = new GitCommitTool();
  if (!tool) {
    throw new Error('Failed to create GitCommitTool instance');
  }
});

Deno.test('GitCommitTool should have required methods', () => {
  const tool = new GitCommitTool();
  
  if (typeof tool.run !== 'function') {
    throw new Error('GitCommitTool should have a run method');
  }
});