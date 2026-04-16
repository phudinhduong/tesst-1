const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function readStdinJson() {
  try {
    const input = fs.readFileSync(0, 'utf8').trim();
    return input ? JSON.parse(input) : {};
  } catch {
    return {};
  }
}

function getToolInput(payload) {
  return payload.tool_input || payload.toolInput || payload.input || payload || {};
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value.flatMap(toArray);
  }

  if (value === undefined || value === null) {
    return [];
  }

  return [value];
}

function getCandidatePaths(toolInput) {
  return [
    ...toArray(toolInput.file_path),
    ...toArray(toolInput.filePath),
    ...toArray(toolInput.path),
    ...toArray(toolInput.paths),
    ...toArray(toolInput.file_paths),
    ...toArray(toolInput.filePaths),
  ]
    .map(normalizePath)
    .filter(Boolean);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    cwd: options.cwd || process.cwd(),
    env: process.env,
    shell: false,
  });

  return {
    ok: !result.error && result.status === 0,
    missing: Boolean(result.error && result.error.code === 'ENOENT'),
    status: result.status,
    error: result.error,
  };
}

function repoRoot() {
  return process.cwd();
}

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot(), relativePath));
}

function gitStatusPorcelain() {
  const result = spawnSync('git', ['status', '--porcelain'], {
    cwd: repoRoot(),
    encoding: 'utf8',
    shell: false,
  });

  if (result.error || result.status !== 0) {
    return [];
  }

  return String(result.stdout || '')
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => line.slice(3).replace(/^"|"$/g, ''));
}

module.exports = {
  exists,
  getCandidatePaths,
  getToolInput,
  gitStatusPorcelain,
  normalizePath,
  readStdinJson,
  repoRoot,
  run,
};