const { getCandidatePaths, getToolInput, normalizePath, readStdinJson } = require('./common');

const protectedPattern = /(^|\/)(\.env(\..*)?|production\.config|package-lock\.json|pnpm-lock\.yaml|yarn\.lock)$|(^|\/)supabase\/migrations(\/|$)|(^|\/)(deploy|infra|terraform|\.github\/workflows)(\/|$)/i;

const payload = readStdinJson();
const toolInput = getToolInput(payload);
const targetPaths = getCandidatePaths(toolInput);

if (!targetPaths.some((candidate) => protectedPattern.test(normalizePath(candidate)))) {
  process.exit(0);
}

console.error('BLOCKED: protected file/path requires explicit approval');
process.exit(2);