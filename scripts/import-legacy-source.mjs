import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execSync } from 'node:child_process';

const repoRoot = process.cwd();
const commonGitDir = execSync('git rev-parse --git-common-dir', { cwd: repoRoot, encoding: 'utf8' }).trim();
const sharedRepoRoot = path.resolve(repoRoot, commonGitDir, '..');
const defaultLegacyDir = path.resolve(sharedRepoRoot, '..', 'changdaye.github.io');
const legacyDir = process.env.LEGACY_BLOG_DIR ?? defaultLegacyDir;
const targets = [
  ['_posts', 'imported/_posts'],
  ['img', 'imported/img'],
  ['about.html', 'imported/about.html'],
  ['_config.yml', 'imported/_config.yml']
];

if (!existsSync(legacyDir)) {
  throw new Error(`Legacy blog directory not found: ${legacyDir}`);
}

for (const [, dest] of targets) {
  rmSync(path.join(repoRoot, dest), { recursive: true, force: true });
}

rmSync(path.join(repoRoot, 'app/public/images/site'), { recursive: true, force: true });
mkdirSync(path.join(repoRoot, 'imported'), { recursive: true });
mkdirSync(path.join(repoRoot, 'app/public/images/site'), { recursive: true });

for (const [source, dest] of targets) {
  cpSync(path.join(legacyDir, source), path.join(repoRoot, dest), { recursive: true });
}

cpSync(path.join(legacyDir, 'img'), path.join(repoRoot, 'app/public/images/site'), { recursive: true });

console.log(`Imported legacy content from ${legacyDir}`);
