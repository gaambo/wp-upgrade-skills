# AGENTS.md

Guide for coding agents contributing to this repository itself (generator + templates), not for using generated skills in downstream projects.

## Scope

- This repository generates versioned WordPress upgrade Agent Skills.
- Keep implementation simple: Node.js ESM scripts, deterministic writes, minimal dependencies.
- `.build/` is temporary build state and must never be committed.
- `skills/update-to-wordpress-<version>/` is the published output.

## Commands

Run from repository root.

- Install dependencies: `npm --prefix bin install`
- Generate one release: `node bin/make-release-notes.mjs 6.9`
- Validate generated skills: `node bin/validate-skills.mjs`
- Format files: `npm --prefix bin run format`
- Check formatting: `npm --prefix bin run format:check`

## Build/lint/test reality

- Formatting check is available via `npm --prefix bin run format:check`.
- There is no formal `npm test` suite.
- The practical verification command is `node bin/validate-skills.mjs` to validate built skills.
- Full generation is functional verification, not a fast test.
- CI on `main` runs formatting check + skill validation.

## Agent execution policy

- Do **not** run full generation (`make-release-notes`) unless the user explicitly asks.
- Full generation can be slow and may timeout in agent sessions.
- Use smallest-first validation and explain what you checked.
- If full verification is needed, ask the user to run it locally and report results.

## How this repo works (high-level)

Pipeline in `bin/make-release-notes.mjs` and `bin/lib/build-skill.mjs`:

1. normalize version and derive slugs
2. discover source posts from WordPress Core feeds
3. fetch and extract article markdown
4. summarize each source via isolated Opencode calls
5. combine summaries into category files
6. generate final skill directory + `SKILL.md`
7. validate required structure and frontmatter naming

## Working rules for agents

- Follow existing local patterns in touched files.
- Keep changes focused and avoid unrelated refactors.
- Preserve pipeline order unless requirement changes.
- Keep prompts and parsers in sync when schema changes.
- Update README and validator behavior together when outputs change.
- Do not hand-edit `.build/**` artifacts.
- Only hand-edit `skills/**` artifacts if user explicitly asks you to update some specific things in it.

## Code style guidance

- Match the current codebase style in each edited file.
- Use explicit ESM imports and current module boundaries.
- Use clear names, small functions, and stage-oriented flow.
- Validate untrusted inputs at boundaries and fail with actionable errors.
- Keep filesystem operations deterministic (clean/create/write).

## Prettier

- Scripts: `npm --prefix bin run format` and `npm --prefix bin run format:check`.

## Non-goals

- No hosted backend service.
- No custom end-user CLI beyond current generator scripts.
- No committing temporary raw source artifacts.
- No monolithic release-notes file replacing area files.
