# AGENTS.md

## Core rules
- Read relevant files before editing.
- Prefer the smallest safe change.
- Preserve existing patterns and public APIs.
- Do not touch unrelated code.
- Do not add dependencies unless necessary.
- For bug fixes, add a regression test when practical.

## Workflow
1. Inspect relevant code.
2. State root cause or approach briefly.
3. Make a short plan for non-trivial tasks.
4. Implement.
5. Run targeted tests/typecheck/lint.
6. Summarize files changed, validation, and risks.

## Protected areas
<!-- Do not modify without explicit approval:
- `.env*`
- migrations
- deployment/infra config
- auth/billing/permissions logic
- generated files
- lockfiles -->

## Validation commands
- test: `npm test`
- lint: `npm run lint`
- typecheck: `npm run typecheck`
- build: `npm run build`

## Shared Hooks
- Canonical hooks live in `hooks/hooks.json` and are shared across all agents.
- Hook behavior is split into helper scripts under `hooks/scripts/` to keep the policy portable.
- Protect new generated artifacts by updating `hooks/hooks.json` and `.gitignore` together.

## Done when
- requested change is complete
- relevant checks pass
- diff is minimal and scoped
- final summary is provided