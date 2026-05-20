# wp-upgrade-skills

Generate versioned Agent Skills for auditing WordPress upgrades using official WordPress Core release posts.

This repository builds skills like `skills/update-to-wordpress-6-9/` from official WordPress Core dev notes and field guides on `make.wordpress.org/core`, extracts article markdown, summarizes each source in isolated agent runs, deduplicates findings, and publishes compact release-note files optimized for upgrading.

## Available skills

- `update-to-wordpress-6-9` - published skill for auditing WordPress 6.9 upgrade
- `update-to-wordpress-7-0` - published skill for auditing WordPress 7.0 upgrade
- Future generated skills follow the same `update-to-wordpress-x-y` naming pattern under `skills/`

## Install and use the skills

### Via NPX

Install from a repository with the [Skills CLI (`vercel-labs/skills`)](https://github.com/vercel-labs/skills) that supports GitHub sources:

```bash
npx skills add gaambo/wp-upgrade-skills
```

Update installed skills:

```bash
# Check if updates are available
npx skills check

# Update all installed skills
npx skills update
```

Learn more: [https://github.com/vercel-labs/skills](https://github.com/vercel-labs/skills)

### Manual installation:

1. Generate or choose the versioned skill directory you want, for example `skills/update-to-wordpress-6-9/`.
2. Copy that folder into your local skills directory.
3. Keep `SKILL.md` at the top level of the copied skill folder.

Usage depends on the host tool, but the important part is the skill name. For example:

- select `update-to-wordpress-6-9` in tools that support explicit skill selection
- or prompt your agent with requests like:
  - "Use `update-to-wordpress-6-9` to audit this plugin for upgrade risk."
  - "Use `update-to-wordpress-6-9` to review this theme for editor and frontend impact."

The generated skill starts with breaking changes and deprecations, then expands to other release-note files only when the repository shape suggests they matter.

## What this repository does

- Discovers release posts from the official Core versioned dev-notes feed (example: `https://make.wordpress.org/core/tag/dev-notes-6-9/feed/`)
- Uses all items from that release-specific dev-notes feed as source inputs and also checks the release tag feed for field-guide posts
- Fetches each source article directly as markdown via WordPress Core's `output_format=markdown` response
- Stores raw extracted article markdown only in `.build/` (temporary artifacts)
- Runs one AI summarization call per source article
- Runs a final AI combine/deduplicate pass across all summaries
- Generates a standards-compliant Agent Skill at `skills/update-to-wordpress-x-y/`
- Preserves source attribution so generated release-note items remain traceable to original `make.wordpress.org/core` posts

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
npm --prefix bin run generate -- 6.9
node bin/make-release-notes.mjs 6.9
```

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
- `SKILL.md` includes source provenance for official WordPress Core posts
- each release-note item with findings includes a `Sources` block with at least one `make.wordpress.org/core` URL

This project does not ship a custom end-user CLI.

## Skill design and workflow

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

## Attribution and disclaimer

- Source material is from official WordPress Core developer posts on `make.wordpress.org/core`.
- Thanks to the WordPress contributors and writers who published the dev notes and field guides this repository builds upon.
- Generated files are structured summaries for engineering workflows and include source attribution.
- Every generated finding should remain traceable to an original source post. If a note lacks a source URL, treat it as incomplete.
- Always verify critical migration decisions against original source posts and your own test matrix.
