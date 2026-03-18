You are combining per-article WordPress upgrade summaries into final category files for one release.

Return markdown only. No preface. No code fences.

## Release version

{{version}}

## Required output files

{{category_files}}

## Input summaries

{{summaries}}

## Output format

Produce one section per file, in this exact wrapper format:

<!-- FILE: breaking-changes.md -->

# Breaking Changes

...

<!-- FILE: deprecated.md -->

# Deprecated

...

Continue for all required files.

## Item format inside each file

# <Category Title>

## <Change Title>

- Type: <type>
- Severity: <severity>
- Applies To: <applies to>
- Summary: <short summary>
- Search For:
    - ...
- Recommended Action:
    - ...
- Related Tickets:
    - <wordpress trac or github issue url>
- Sources:
    - <url>
    - <url>

## Combination rules

- Deduplicate equivalent changes across summaries.
- Merge source URLs for deduplicated items.
- Merge and deduplicate related Trac/GitHub ticket links for each item.
- Assign each item to one primary area/file.
- Prioritize `breaking-change` visibility and clarity.
- Keep content compact, actionable, and non-redundant.
- Avoid repeating the same guidance in multiple files.
- If a category has no items, include a short single-line note under the header.
- Do not invent details not present in input summaries.
