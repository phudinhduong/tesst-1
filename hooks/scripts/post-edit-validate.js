const path = require('node:path');
const { exists, getCandidatePaths, getToolInput, normalizePath, readStdinJson, run, repoRoot } = require('./common');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const mvnCommand = process.platform === 'win32' ? 'mvn.cmd' : 'mvn';

function hasPrefix(value, prefix) {
  return normalizePath(value).toLowerCase().startsWith(prefix.toLowerCase());
}

function validateFrontend() {
  if (!exists('frontend/package.json')) {
    return;
  }

  const result = run(npmCommand, ['run', 'build'], { cwd: path.join(repoRoot(), 'frontend') });
  if (!result.ok && !result.missing) {
    console.error('HOOK WARNING: frontend build failed');
  }
}

function validateBackend() {
  if (!exists('backend/pom.xml')) {
    return;
  }

  const result = run(mvnCommand, ['-q', '-DskipTests', 'compile'], { cwd: path.join(repoRoot(), 'backend') });
  if (!result.ok && !result.missing) {
    console.error('HOOK WARNING: backend compile failed');
  }
}

const payload = readStdinJson();
const toolInput = getToolInput(payload);
const targetPaths = getCandidatePaths(toolInput);

const needsFrontend = targetPaths.some((candidate) => hasPrefix(candidate, 'frontend/'));
const needsBackend = targetPaths.some((candidate) => hasPrefix(candidate, 'backend/'));

if (needsFrontend) {
  validateFrontend();
}

if (needsBackend) {
  validateBackend();
}

process.exit(0);