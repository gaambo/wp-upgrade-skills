You are generating a strict, compact upgrade-impact summary from one WordPress Core source article.

Return markdown only. No preface. No code fences.

## Source metadata

- WordPress Version: {{version}}
- Source Title: {{source_title}}
- Source URL: {{source_url}}

## Source markdown

{{source_markdown}}

## Required output schema

Use this exact structure:

# Source Summary

- Source Title: <title>
- Source URL: <url>
- WordPress Version: <version>

## Change

- Type: breaking-change | deprecation | behavior-change | new-feature | tooling
- Area: breaking-changes | deprecated | core-api | editor | frontend | admin | database | performance | tooling
- Applies To: plugin | theme | site | multiple
- Severity: high | medium | low
- Title: <short change title>
- Summary: <1 short paragraph>
- Search For:
    - <literal string, API, hook, function, file pattern, concept, or grep hint>
- Recommended Action:
    - <clear action item>
- Related Tickets:
    - <wordpress trac or github issue url if available>
- Source:
    - <source url>

Repeat `## Change` blocks as needed.

## Rules

- Only include actionable upgrade-impacting changes supported by the source.
- Do not invent unsupported changes.
- Keep wording concise and implementation-oriented.
- Prefer concrete APIs, hooks, settings, behavior deltas, or patterns.
- Include at least one `Search For` hint per change.
- Always include the source URL in each change block.
- Preserve WordPress Trac and GitHub issue links when present and relevant.
- If no relevant ticket links are present, use:
    - Related Tickets:
        - (none)
- If no meaningful upgrade impact exists, output only:

# Source Summary

- Source Title: <title>
- Source URL: <url>
- WordPress Version: <version>
- Note: No meaningful upgrade-impacting changes identified.
