# Core API

## Breadcrumbs block exposes filters to customize trail items and taxonomy selection

- Type: new-feature
- Severity: low
- Applies To: multiple
- Summary: Breadcrumbs block adds filters `block_core_breadcrumbs_items` and `block_core_breadcrumbs_post_type_settings` to modify items and select taxonomy/term preferences. Item arrays support `label`, optional `url`, and optional `allow_html` (sanitized with `wp_kses_post()` when true).
- Search For:
    - block_core_breadcrumbs_items
    - block_core_breadcrumbs_post_type_settings
    - allow_html
    - wp_kses_post
    - esc_html
- Recommended Action:
    - Update plugins/themes that modify breadcrumb output to use `block_core_breadcrumbs_items`.
    - When adding items, provide `label` and optional `url`; set `allow_html` only when safe.
    - Use `block_core_breadcrumbs_post_type_settings` to pick taxonomy/term preferences and handle documented fallbacks.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/pull/74169
    - https://github.com/WordPress/gutenberg/pull/73283
    - https://github.com/WordPress/gutenberg/pull/74170
- Sources:
    - https://make.wordpress.org/core/2026/03/04/breadcrumb-block-filters/

## New watch() function in @wordpress/interactivity

- Type: new-feature
- Severity: low
- Applies To: multiple
- Summary: `watch()` subscribes to reactive values accessed inside a callback and re-runs the callback when those values change. Returns an `unwatch()` cleanup function and supports per-run cleanup.
- Search For:
    - watch(
    - "from '@wordpress/interactivity'"
    - unwatch()
    - data-wp-watch
- Recommended Action:
    - Use `watch()` for side effects based on interactivity store values (analytics, syncing). Ensure you call `unwatch()` or return a cleanup to avoid leaks.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/pull/75563
- Sources:
    - https://make.wordpress.org/core/2026/02/23/changes-to-the-interactivity-api-in-wordpress-7-0/

## core/router state.url is now initialized on the server

- Type: behavior-change
- Severity: low
- Applies To: multiple
- Summary: `state.url` in the `core/router` store is populated during server-side directive processing rather than initialized from `window.location.href`. It will be present on first load and only change on the first client-side navigation.
- Search For:
    - state.url
    - core/router
    - "window.location.href"
    - interactivity-router
- Recommended Action:
    - Remove or adjust guards that assumed `state.url` was undefined on initial load.
    - Use `watch()` on `core/router` `state.url` to detect client-side navigations reliably (e.g., for analytics).
- Related Tickets:
    - https://github.com/WordPress/wordpress-develop/pull/10944
- Sources:
    - https://make.wordpress.org/core/2026/02/23/changes-to-the-interactivity-api-in-wordpress-7-0/

## Client-side Abilities API: @wordpress/abilities and @wordpress/core-abilities

- Type: new-feature
- Severity: medium
- Applies To: plugin
- Summary: Client-side Abilities API split into `@wordpress/abilities` (standalone client store) and `@wordpress/core-abilities` (fetches/registers server abilities from `/wp-abilities/v1`). Modules load as ES modules and integrate with `core/abilities` store.
- Search For:
    - "@wordpress/abilities"
    - "@wordpress/core-abilities"
    - "wp_enqueue_script_module"
    - registerAbility
    - registerAbilityCategory
- Recommended Action:
    - Enqueue the correct module: use `@wordpress/core-abilities` when server-registered abilities are needed; otherwise use `@wordpress/abilities`.
    - Load as script modules or dynamic import and read abilities via `core/abilities` store.
    - Ensure category slugs use lowercase alphanumeric with dashes.
- Related Tickets:
    - (none)
- Sources:
    - https://make.wordpress.org/core/2026/03/24/client-side-abilities-api-in-wordpress-7-0/

## executeAbility enforces JSON schemas, permission callbacks, and maps REST verbs from annotations

- Type: behavior-change
- Severity: medium
- Applies To: plugin
- Summary: `executeAbility` validates inputs/outputs against declared schemas and enforces permission callbacks; server-side abilities' HTTP methods are chosen from annotations (readonly → GET, destructive+idempotent → DELETE, otherwise POST). Validation failures throw specific error codes (`ability_invalid_input`, `ability_invalid_output`, `ability_permission_denied`).
- Search For:
    - executeAbility
    - ability_invalid_input
    - ability_invalid_output
    - ability_permission_denied
    - /wp-abilities/v1
    - readonly, destructive, idempotent
- Recommended Action:
    - Declare accurate annotations and provide `input_schema`/`output_schema`.
    - Catch and handle documented error codes in client calls.
    - Verify behavior on admin pages where `@wordpress/core-abilities` is enqueued.
- Related Tickets:
    - (none)
- Sources:
    - https://make.wordpress.org/core/2026/03/24/client-side-abilities-api-in-wordpress-7-0/

## Connectors API and WP_Connector_Registry

- Type: new-feature
- Severity: medium
- Applies To: plugin
- Summary: Adds a Connectors API with a WP_Connector_Registry singleton created during `init` and helpers `wp_is_connector_registered()`, `wp_get_connector()`, `wp_get_connectors()`. Plugins must register via `wp_connectors_init` or use the public functions after `init`.
- Search For:
    - wp_connectors_init
    - WP_Connector_Registry
    - wp_is_connector_registered
    - wp_get_connector
    - wp_get_connectors
- Recommended Action:
    - Hook into `wp_connectors_init` to register/modify connectors. Do not interact with the registry before `init`.
- Related Tickets:
    - (none)
- Sources:
    - https://make.wordpress.org/core/2026/03/18/introducing-the-connectors-api-in-wordpress-7-0/

## PHP-only blocks via register_block_type + supports.autoRegister

- Type: new-feature
- Severity: low
- Applies To: multiple
- Summary: Support for PHP-only blocks allows simple server-rendered blocks to be registered with `register_block_type` plus `supports.autoRegister` and a `render_callback`; the editor will surface Inspector Controls for supported attribute types.
- Search For:
    - register_block_type
    - "autoRegister"
    - "supports' => array( 'autoRegister' => true )"
    - render_callback
- Recommended Action:
    - Use `register_block_type(..., [ 'render_callback' => ..., 'supports' => [ 'autoRegister' => true ] ])` for simple server-driven blocks.
    - Verify attributes use supported types to get Inspector Controls.
    - Continue using client-side registration for interactive blocks.
- Related Tickets:
    - https://core.trac.wordpress.org/ticket/64639
- Sources:
    - https://make.wordpress.org/core/2026/03/03/php-only-block-registration/

## theme.json pseudo-class selectors for blocks and variations

- Type: new-feature
- Severity: medium
- Applies To: theme
- Summary: `theme.json` supports `:hover`, `:focus`, `:focus-visible`, `:active` pseudo-class selectors inside `styles.blocks` for blocks and variations (theme.json-only API in 7.0; no Global Styles UI yet).
- Search For:
    - "theme.json"
    - "styles.blocks"
    - "variations"
    - ":hover" ":focus" ":focus-visible" ":active"
- Recommended Action:
    - Move supported interactive styles into `styles.blocks`/variation objects where appropriate and limit selectors to the supported list.
    - Test block variations and ensure selector conflicts are avoided.
- Related Tickets:
    - https://core.trac.wordpress.org/ticket/64263
    - https://github.com/WordPress/gutenberg/issues/38277
- Sources:
    - https://make.wordpress.org/core/2026/03/09/pseudo-element-support-for-blocks-and-their-variations-in-theme.json/
