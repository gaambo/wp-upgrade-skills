# Frontend

## Viewport-hidden blocks are rendered in the DOM and hidden with CSS (not removed)

- Type: behavior-change
- Severity: medium
- Applies To: multiple
- Summary: Blocks hidden for specific viewports are now rendered into the DOM and hidden via CSS (when `blockVisibility` is an object with `viewport` keys). This differs from `blockVisibility: false` which prevents server-side rendering.
- Search For:
    - `<!-- wp:paragraph {"metadata":{"blockVisibility":{"viewport":{"mobile":false}}}} -->`
    - `blockVisibility: false`
    - front-end DOM/CSS hiding patterns
- Recommended Action:
    - Audit themes, caching, server-side renderers, scrapers and accessibility checks that assumed hidden blocks were absent. If content must be excluded for SEO or non-visual contexts, continue using `blockVisibility: false`. Update CSS/JS selectors and integration tests to account for CSS-hidden DOM nodes.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/issues/73776
    - https://github.com/WordPress/gutenberg/issues/72502
    - https://github.com/WordPress/gutenberg/issues/75707
- Sources:
    - https://make.wordpress.org/core/2026/03/15/block-visibility-in-wordpress-7-0/

## Default removal of "Posts by Author" title attributes for author archive links

- Type: behavior-change
- Severity: medium
- Applies To: multiple
- Summary: `the_author_posts_link()` and `wp_list_authors()` no longer output the "Posts by Author" title attribute by default in 7.0. `the_author_posts_link` filter now receives `$link, $author, $title` for reconstruction.
- Search For:
    - `the_author_posts_link`
    - `add_filter( 'the_author_posts_link'`
    - `wp_list_authors(`
    - `title="Posts by`
- Recommended Action:
    - Update themes/plugins that relied on title attributes to use visible text or ARIA attributes. Restore prior behavior via `the_author_posts_link` filter (3 args) or adjust parsing of `wp_list_authors` output.
- Related Tickets:
    - https://core.trac.wordpress.org/ticket/62835
- Sources:
    - https://make.wordpress.org/core/2026/05/14/removing-title-attributes-in-author-link-functions/

## Paragraph selector behaviour for text-indent (subsequent vs all)

- Type: behavior-change
- Severity: medium
- Applies To: theme
- Summary: Core paragraph `typography.textIndent` supports a `subsequent` selector (`.wp-block-paragraph + .wp-block-paragraph`) by default; setting `all` uses `.wp-block-paragraph`. This setting is configurable in `theme.json`.
- Search For:
    - `settings.typography.textIndent` in theme.json
    - `styles.blocks."core/paragraph".typography.textIndent`
    - `.wp-block-paragraph + .wp-block-paragraph`
    - `.wp-block-paragraph`
- Recommended Action:
    - Theme authors should set `settings.typography.textIndent` to `subsequent` or `all` as appropriate and test LTR/RTL languages. Audit theme CSS that targets `.wp-block-paragraph` for conflicts and adjust specificity if needed.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/pull/74889
- Sources:
    - https://make.wordpress.org/core/2026/03/15/new-block-support-text-indent-textindent/
