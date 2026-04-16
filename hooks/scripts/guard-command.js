const { getToolInput, readStdinJson } = require('./common');

const destructivePattern = /(^|[\s"'`])(rm\s+-rf|git\s+push|git\s+reset\s+--hard|git\s+clean\s+-fd|vercel\s+--prod|npm\s+publish)([\s"'`]|$)/i;

const payload = readStdinJson();
const toolInput = getToolInput(payload);
const command = String(toolInput.command || toolInput.commandLine || toolInput.shellCommand || '');

if (!destructivePattern.test(command)) {
  process.exit(0);
}

console.error('BLOCKED: destructive or deploy command requires explicit approval');
process.exit(2);