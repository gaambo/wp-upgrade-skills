# wp-upgrade-skills

Generate versioned Agent Skills for auditing WordPress upgrades using official WordPress Core release posts.

This repository generates a skill like `skills/update-to-wordpress-6-9/` from the WordPress Core release tag feed, extracts article markdown, summarizes each source in isolated agent runs, deduplicates findings, and publishes compact release-note files optimized for progressive disclosure.

## What this repository does

- Discovers release posts from the official Core versioned dev-notes feed (example: `https://make.wordpress.org/core/tag/dev-notes-6-9/feed/`)
- Uses all items from that release-specific dev-notes feed as source inputs
- Fetches each source article and converts it to markdown programmatically via `defuddle`
- Stores raw extracted article markdown only in `.build/` (temporary artifacts)
- Runs one Opencode summarization call per source article
- Runs a final Opencode combine/deduplicate pass across all summaries
- Generates a standards-compliant Agent Skill at `skills/update-to-wordpress-x-y/`

## Repository structure

```
.
├── bin/
│   ├── package.json
│   ├── make-release-notes.mjs
│   ├── validate-skills.mjs
│   ├── templates/
│   └── lib/
├── skills/
│   └── update-to-wordpress-x-y/ (generated)
├── .build/ (ignored)
└── README.md
```

## Requirements

- Node.js 20+
- `opencode` installed and available in `PATH`
- `bin/opencode.jsonc` sets model defaults for generation (`github-copilot/gpt-5-mini`)

Install dependencies:

```bash
npm --prefix bin install
```

## Generate release notes and a skill

Example for WordPress 6.9:

```bash
node bin/make-release-notes.mjs 6.9
```

Equivalent via npm script:

```bash
npm --prefix bin run generate -- 6.9
```

Both commands resolve paths relative to repository root, so they work even when executed from inside `bin/`.

Expected output:

- Build artifacts: `.build/releases/6.9/`
  - `manifest.json`
  - `rss-discovery.json` (full feed discovery + filter diagnostics)
  - `opencode/*.stdout.txt` and `opencode/*.stderr.txt` (one pair per summarize/combine run)
  - `sources/*.raw.md`
  - `summaries/*.summary.md`
  - `combined/*.md`
- Published skill: `skills/update-to-wordpress-6-9/`
  - `SKILL.md`
  - `release-notes/*.md`

`.build/` is temporary and git-ignored.

If discovery looks off, inspect `.build/releases/<version>/rss-discovery.json`.
It includes every feed item returned by the dev-notes feed and the selected list.

The generator reads from `dev-notes-<version>` and also checks `<version>` for additional `field-guide` posts.
Both feeds and merge behavior are captured in `rss-discovery.json`.

## Validate generated skills

```bash
npm --prefix bin run validate
```

The validator always checks `<repo>/skills/` (not `bin/skills/`).

Validation checks:

- `SKILL.md` exists
- YAML frontmatter `name` exactly matches directory name
- required `release-notes/*.md` files exist

## Installation for end users

Install from a repository with Skills CLI:

```bash
npx skills add gaambo/<repo-name>
```

Manual installation:

1. Generate the skill directory with `node bin/make-release-notes.mjs <version>`.
2. Copy `skills/update-to-wordpress-<version>/` into your local skills directory.
3. Ensure `SKILL.md` remains at the top level of that skill folder.

This project does not ship a custom end-user CLI.

## Progressive-disclosure design

The generated `SKILL.md` is intentionally short and operational:

- routes the agent to only the most relevant area files first
- starts with `breaking-changes.md` and `deprecated.md`
- expands to other areas only when repo shape or findings require it

The generated skill also instructs agents to:

- detect local WordPress runtime/tooling files (for example Docker and wp-env) and include environment upgrade steps when present
- detect Composer-managed WordPress installs and include `composer.json` / lockfile update steps when present
- switch behavior between research/plan mode and implementation mode
- produce PR-friendly output when used in GitHub automation
- use subagents/parallelized area reviews where supported, then merge results in one coordinator pass

Detailed release content is split across:

- `breaking-changes.md`
- `deprecated.md`
- `core-api.md`
- `editor.md`
- `frontend.md`
- `admin.md`
- `database.md`
- `performance.md`
- `tooling.md`

## Example agent usage

- "Audit this plugin for WordPress 6.9 upgrade risk and output a TODO list."
- "Review this theme for frontend and editor impact in WordPress 6.9."
- "Create patch recommendations for breaking changes and deprecations first."

## Opencode integration notes

The generator shells out directly to the OpenCode CLI via:

```bash
opencode run "<prompt>"
```

Defaults:

- command: `opencode`
- mode: non-interactive `run`

## Ticket references

Summarization and combine prompts require preserving relevant WordPress Trac / GitHub ticket links.
Generated release-note items should retain these links under `Related Tickets` when available.

## Attribution and disclaimer

- Source material is from official WordPress Core developer posts on `make.wordpress.org/core`.
- Generated files are structured summaries for engineering workflows and include source attribution.
- Always verify critical migration decisions against original source posts and your own test matrix.
