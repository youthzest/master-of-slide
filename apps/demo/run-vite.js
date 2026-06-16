import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// NFD normalized path (macOS Native Hangeul Representation)
const repoRoot = '/Users/almond-mac/Antigravity/옵시디언- 마스터오브 슬라이드';
const tempDir = '/Users/almond-mac/core-temp';

console.log("Starting secure compilation workflow (NFD Mode)...");

try {
  // 1. Clean existing temp dir if any
  if (fs.existsSync(tempDir)) {
    console.log("Cleaning old temp directory...");
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  // 2. Copy packages/core to tempDir
  const sourceCore = path.join(repoRoot, 'packages/core');
  console.log(`Copying @open-slide/core from: ${sourceCore} to: ${tempDir}`);
  fs.cpSync(sourceCore, tempDir, { recursive: true });

  // 3. Create symlink to root node_modules
  const sourceNodeModules = path.join(repoRoot, 'node_modules');
  const targetNodeModules = path.join(tempDir, 'node_modules');
  console.log(`Creating symlink from: ${sourceNodeModules} to: ${targetNodeModules}`);
  fs.symlinkSync(sourceNodeModules, targetNodeModules, 'dir');

  // 4. Run tsdown build inside tempDir
  console.log("Running tsdown compilation inside temporary directory...");
  const tsdownBin = path.join(repoRoot, 'node_modules', '.bin', 'tsdown');
  execSync(`"${tsdownBin}"`, { cwd: tempDir, stdio: 'inherit' });
  console.log("Compilation in temp directory succeeded!");

  // 5. Copy compiled dist back to original packages/core/dist
  const originalDist = path.join(repoRoot, 'packages/core', 'dist');
  console.log(`Deploying compiled artifacts back to: ${originalDist}`);
  if (fs.existsSync(originalDist)) {
    fs.rmSync(originalDist, { recursive: true, force: true });
  }
  fs.cpSync(path.join(tempDir, 'dist'), originalDist, { recursive: true });
  console.log("Deploy completed successfully!");

  // 6. Cleanup temp dir
  console.log("Cleaning up temp directory...");
  fs.rmSync(tempDir, { recursive: true, force: true });
} catch (err) {
  console.error("CRITICAL BUILD ERROR OCCURRED:");
  console.error(err);
  process.exit(1);
}

// 7. Mock process.argv and start Vite dev server on port 5175
const nfcCwd = '/Users/almond-mac/Antigravity/옵시디언- 마스터오브 슬라이드/apps/demo';
process.cwd = () => nfcCwd;

process.argv = [
  process.argv[0],
  '/Users/almond-mac/Antigravity/옵시디언- 마스터오브 슬라이드/packages/core/dist/cli/bin.js',
  'dev',
  '--host',
  '127.0.0.1',
  '--port',
  '5175',
  '--no-skills-check'
];

console.log("Starting Open-Slide dev server on port 5175 via core/dist/cli/bin.js...");
import('../../packages/core/dist/cli/bin.js');
