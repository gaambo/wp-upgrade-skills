# Breaking Changes

## blockVisibility metadata can be boolean or an object with a viewport key

- Type: breaking-change
- Severity: medium
- Applies To: multiple
- Summary: The `blockVisibility` metadata field may be either a boolean (`false`) or an object (`{ "viewport": { "mobile": false, "tablet": true, "desktop": true } }`). Code that assumed a scalar value must accept both forms.
- Search For:
    - `"blockVisibility": {`
    - `"metadata": { "blockVisibility": false }`
- Recommended Action:
    - Update parsers/generators in PHP/JS to detect whether `blockVisibility` is a boolean or an object/array before treating it as "hidden".
    - When generating visibility rules, produce the `viewport` object form.
    - Add unit tests covering both shapes.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/issues/73776
    - https://github.com/WordPress/gutenberg/issues/72502
    - https://github.com/WordPress/gutenberg/issues/50756
    - https://github.com/WordPress/gutenberg/issues/75707
- Sources:
    - https://make.wordpress.org/core/2026/03/15/block-visibility-in-wordpress-7-0/

## Custom navigation overlays are tied to the active theme and not preserved on theme switch

- Type: breaking-change
- Severity: high
- Applies To: site
- Summary: Navigation overlay template parts are stored per-theme. Custom overlays created for one theme will not be preserved when switching themes.
- Search For:
    - "template parts are currently tied to the active theme"
    - https://github.com/WordPress/gutenberg/issues/72452
- Recommended Action:
    - Export or record custom overlay markup/patterns before switching themes and reapply them after switching.
    - Inform site editors/stakeholders that overlays will not survive a theme change.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/issues/72452
- Sources:
    - https://make.wordpress.org/core/2026/03/04/customisable-navigation-overlays-in-wordpress-7-0/

## DataViews view config grouping API changed from groupByField to groupBy object

- Type: breaking-change
- Severity: high
- Applies To: multiple
- Summary: The DataViews view config no longer uses `groupByField` (string). Replace it with a `groupBy` object (`{ field, direction, showLabel }`) to access new grouping options.
- Search For:
    - groupByField
    - `groupBy: { field:`
- Recommended Action:
    - Migrate configs that set `groupByField` to `groupBy: { field: '<name>', direction: 'asc|desc', showLabel: true|false }`.
    - Update (de)serialization logic and add a migration or compatibility shim before shipping.
    - Test grouped views across layouts after migration.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/issues/73076
- Sources:
    - https://make.wordpress.org/core/2026/03/04/dataviews-dataform-et-al-in-wordpress-7-0/

## Minimum supported PHP raised to 7.4 (PHP 7.2 & 7.3 dropped)

- Type: breaking-change
- Severity: medium
- Applies To: multiple
- Summary: WordPress 7.0 no longer supports PHP 7.2 or 7.3. The minimum supported PHP version is 7.4 (recommended 8.3).
- Search For:
    - "PHP 7.2"
    - "PHP 7.3"
    - "requires PHP 7.4"
    - composer.json platform entries or CI matrices including 7.2/7.3
- Recommended Action:
    - Test code on PHP 7.4+ and add 7.4 to CI matrices.
    - Update plugin/theme readme headers and composer.json `require`/`platform` to `php >=7.4` where applicable.
    - Remove or replace compatibility shims for 7.2/7.3 or maintain a separate legacy branch if needed.
    - Advise hosting/clients to upgrade PHP.
- Related Tickets:
    - https://core.trac.wordpress.org/ticket/62622
    - https://github.com/WordPress/gutenberg/issues/74456
- Sources:
    - https://make.wordpress.org/core/2026/01/09/dropping-support-for-php-7-2-and-7-3/

## Bundled AI client conflicts and API surface changes (composer/class and exception differences)

- Type: breaking-change
- Severity: high
- Applies To: plugin
- Summary: Core bundles a provider-agnostic PHP AI client. Plugins that also include `wordpress/php-ai-client` will face duplicate class/autoload conflicts unless they stop loading those classes or conditionally autoload for older WP versions. Additionally, Core exposes a WordPress wrapper that uses snake_case and `WP_Error` instead of the upstream SDK's camelCase methods and exceptions — plugins must update call sites and error handling.
- Search For:
    - AI_Client::prompt
    - wp_ai_client_prompt
    - WP_AI_Client_Prompt_Builder
    - vendor/autoload.php
    - is_wp_error
    - version_compare( wp_get_wp_version(), '7.0', '<' )
- Recommended Action:
    - If you can require WP 7.0+, update plugin header to "Requires at least: 7.0" and remove the `wordpress/php-ai-client` Composer dependency.
    - If supporting older WP versions, conditionally register the Composer autoloader (version_compare check) or split the dependency so it only autoloads on older WP.
    - Replace direct SDK calls with `wp_ai_client_prompt()` and snake_case builder methods; replace try/catch exception logic with `is_wp_error()` checks or appropriate object handling.
- Related Tickets:
    - (none)
- Sources:
    - https://make.wordpress.org/core/2026/03/24/introducing-the-ai-client-in-wordpress-7-0/
