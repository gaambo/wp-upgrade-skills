# Breaking Changes

## blockVisibility metadata may be a boolean or a viewport object

- Type: breaking-change
- Severity: high
- Applies To: multiple
- Summary: The serialized block metadata `blockVisibility` can be the old boolean (`false`) or a new object with a `viewport` key (`{ viewport: { mobile: false, tablet: true, desktop: true } }`). Server-side parsers, transforms, migrations and validators must accept both shapes.
- Search For:
    - `attrs.metadata.blockVisibility`
    - `{"metadata":{"blockVisibility":false}}`
    - `{"metadata":{"blockVisibility":{"viewport":{"mobile":false}}}}`
    - `visibility` (block supports key) and PR 73432
- Recommended Action:
    - Update server-side parsers, transforms and validators to accept a boolean or object shape. Treat boolean `false` as hide‑everywhere; if object, inspect `viewport.mobile|tablet|desktop`. Update tests and any reusable block assertions to accept both shapes.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/issues/73776
    - https://github.com/WordPress/gutenberg/issues/72502
    - https://github.com/WordPress/gutenberg/issues/50756
    - https://github.com/WordPress/gutenberg/pull/73432
- Sources:
    - https://make.wordpress.org/core/2026/03/15/block-visibility-in-wordpress-7-0/

## DataViews view config: groupByField replaced by groupBy object

- Type: breaking-change
- Severity: high
- Applies To: plugin
- Summary: The old string property `groupByField` in DataViews view configs is removed and replaced with a `groupBy` object including `field`, `direction`, and `showLabel`. Configs still using `groupByField` will no longer apply grouping.
- Search For:
    - `groupByField`
    - `view = { groupByField:`
    - `view = { groupBy:`
- Recommended Action:
    - Replace `groupByField: 'foo'` with `groupBy: { field: 'foo', direction: 'asc' | 'desc', showLabel: true | false }` wherever DataViews view configs are constructed.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/issues/73076
- Sources:
    - https://make.wordpress.org/core/2026/03/04/dataviews-dataform-et-al-in-wordpress-7-0/

## Composer-bundled php-ai-client conflicts on WP 7.0 — remove or conditional-load

- Type: breaking-change
- Severity: high
- Applies To: plugin
- Summary: Core bundles the php-ai-client library on WP 7.0+. Plugins that still ship `wordpress/php-ai-client` via Composer will cause duplicate class errors on 7.0+. Plugins must stop shipping the PHP SDK or load it conditionally on pre-7.0 installs.
- Search For:
    - `AI_Client::prompt()`
    - `"wordpress/php-ai-client"` in composer.json
    - conditional autoloader snippet: `if ( ! function_exists( 'wp_get_wp_version' ) || version_compare( wp_get_wp_version(), '7.0', '<' ) ) { require_once __DIR__ . '/vendor/autoload.php'; }`
- Recommended Action:
    - Preferred: bump plugin minimum to WP 7.0 and remove the Composer dependency; replace direct SDK calls with `wp_ai_client_prompt()`.
    - If supporting <7.0, conditionally register the Composer autoloader only on older installs or split autoloading so duplication is avoided. Test on WP 6.x and 7.0.
- Related Tickets:
    - https://github.com/WordPress/wp-ai-client/blob/trunk/UPGRADE.md
- Sources:
    - https://make.wordpress.org/core/2026/03/24/introducing-the-ai-client-in-wordpress-7-0/

## Connector plugin metadata key changed from plugin.slug to plugin.file

- Type: breaking-change
- Severity: high
- Applies To: plugin
- Summary: Connector registration that used `plugin.slug` will silently lose plugin meta in 7.0; registrations must use `plugin.file` (the plugin's main file path relative to the plugins directory).
- Search For:
    - `"plugin.slug"`
    - `"plugin.file"`
    - connector registration
- Recommended Action:
    - Audit connector registrations and replace `plugin.slug` with `plugin.file` (e.g., `ai-provider-for-anthropic/plugin.php`). Test the Connectors admin screen to ensure install/activate links and metadata show correctly.
- Related Tickets:
    - https://core.trac.wordpress.org/ticket/65002
    - https://core.trac.wordpress.org/changeset/62192
- Sources:
    - https://make.wordpress.org/core/2026/03/18/introducing-the-connectors-api-in-wordpress-7-0/

## Blocks must declare content role to remain editable inside contentOnly patterns

- Type: breaking-change
- Severity: high
- Applies To: multiple
- Summary: `contentOnly` patterns hide non-content attributes by default. Attributes that represent editable content inside contentOnly containers must be declared with `"role": "content"` in block.json (or the block must support `contentRole`) or they will be hidden from List View and become non-selectable.
- Search For:
    - `"role": "content"`
    - `"contentRole": true`
    - `contentOnly`
    - block.json
- Recommended Action:
    - Update block.json attribute declarations to include `"role": "content"` for attributes that should remain editable inside patterns. Where appropriate, add `supports.contentRole: true`. Re-test pattern insertion, List View, and editor selection for affected blocks and templates.
- Related Tickets:
    - https://developer.wordpress.org/news/2024/11/how-to-add-content-only-editing-support-to-a-block/
    - https://github.com/WordPress/gutenberg/pull/75457
- Sources:
    - https://make.wordpress.org/core/2026/03/15/pattern-editing-in-wordpress-7-0/
    - https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/

## Verse block renamed to Poetry in core

- Type: breaking-change
- Severity: high
- Applies To: multiple
- Summary: The core block previously named "Verse" has been renamed to "Poetry". Themes, patterns, templates, and plugins referencing the old name/slug may stop matching or rendering the block as expected.
- Search For:
    - `Verse` and `Poetry` in block registrations, templates, patterns, and theme files
    - `core/verse`
    - `core/poetry`
- Recommended Action:
    - Search code, templates and patterns for references to the Verse block (case-sensitive and slug variants). Update registrations, slugs, pattern markup and documentation to use Poetry where appropriate; test and re-save affected content.
- Related Tickets:
    - (none)
- Sources:
    - https://make.wordpress.org/core/2026/04/22/roster-of-design-tools-per-block-wordpress-7-0/

## Minimum PHP version raised to 7.4

- Type: breaking-change
- Severity: high
- Applies To: plugin | theme | site
- Summary: WordPress 7.0 requires PHP 7.4+. Plugins and themes that rely on older PHP versions must be updated to remain compatible.
- Search For:
    - `minimum PHP version`
    - `PHP 7.4`
    - composer.json / CI configs for PHP constraints
- Recommended Action:
    - Update CI, composer.json, and documentation to test/support PHP 7.4+. Refactor incompatible code and notify downstream users of the requirement.
- Related Tickets:
    - https://make.wordpress.org/core/2026/01/09/dropping-support-for-php-7-2-and-7-3/
- Sources:
    - https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/
