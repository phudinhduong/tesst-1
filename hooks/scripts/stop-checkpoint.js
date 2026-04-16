const path = require('node:path');
const { exists, gitStatusPorcelain, normalizePath, repoRoot, run } = require('./common');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const mvnCommand = process.platform === 'win32' ? 'mvn.cmd' : 'mvn';

function hasPrefix(value, prefix) {
  return normalizePath(value).toLowerCase().startsWith(prefix.toLowerCase());
}

function runFrontendBuild() {
  if (!exists('frontend/package.json')) {
    return true;
  }

  const result = run(npmCommand, ['run', 'build'], { cwd: path.join(repoRoot(), 'frontend') });
  if (result.missing) {
    console.error('STOP NOTE: npm is unavailable, skipping frontend validation');
    return true;
  }

  return result.ok;
}

function runBackendCompile() {
  if (!exists('backend/pom.xml')) {
    return true;
  }

  const result = run(mvnCommand, ['-q', '-DskipTests', 'compile'], { cwd: path.join(repoRoot(), 'backend') });
  if (result.missing) {
    console.error('STOP NOTE: mvn is unavailable, skipping backend validation');
    return true;
  }

  return result.ok;
}

const dirtyFiles = gitStatusPorcelain();

if (dirtyFiles.length === 0) {
  process.exit(0);
}

const needsFrontend = dirtyFiles.some((candidate) => hasPrefix(candidate, 'frontend/'));
const needsBackend = dirtyFiles.some((candidate) => hasPrefix(candidate, 'backend/'));

if (needsFrontend && !runFrontendBuild()) {
  console.error('STOP BLOCKED: frontend build failed');
  process.exit(2);
}

if (needsBackend && !runBackendCompile()) {
  console.error('STOP BLOCKED: backend compile failed');
  process.exit(2);
}

const addResult = run('git', ['add', '-A'], { cwd: repoRoot() });
if (!addResult.ok) {
  console.error('STOP BLOCKED: unable to stage checkpoint');
  process.exit(2);
}

const commitProbe = run('git', ['diff', '--cached', '--quiet'], { cwd: repoRoot() });
if (commitProbe.ok) {
  process.exit(0);
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
const commitResult = run('git', ['commit', '-m', `claude: checkpoint ${stamp}`, '--no-verify'], { cwd: repoRoot() });

if (!commitResult.ok) {
  console.error('STOP BLOCKED: unable to create checkpoint commit');
  process.exit(2);
}

process.exit(0);