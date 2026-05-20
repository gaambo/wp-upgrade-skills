# Core API

## New filter `block_core_breadcrumbs_items` to modify breadcrumb items

- Type: new-feature
- Severity: low
- Applies To: multiple
- Summary: WordPress 7.0 adds `block_core_breadcrumbs_items` to allow modifying the Breadcrumbs block's rendered trail. Each item is an array with `label`, optional `url`, and optional `allow_html` (controls `wp_kses_post()` vs `esc_html()`).
- Search For:
    - `block_core_breadcrumbs_items`
    - `allow_html`
    - `wp_kses_post`
    - `esc_html`
- Recommended Action:
    - Search for custom breadcrumb implementations and use the filter to adjust breadcrumb items when appropriate. Only set `allow_html` for trusted markup and add tests where security or markup matters.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/pull/74169
    - https://github.com/WordPress/gutenberg/pull/73283
    - https://github.com/WordPress/gutenberg/pull/74170
- Sources:
    - https://make.wordpress.org/core/2026/03/04/breadcrumb-block-filters/

## New `watch()` helper in @wordpress/interactivity

- Type: new-feature
- Severity: medium
- Applies To: multiple
- Summary: @wordpress/interactivity adds `watch()` which runs a callback immediately and re-runs it whenever any reactive value accessed inside changes. It returns `unwatch()` and supports cleanup functions.
- Search For:
    - `import { watch } from '@wordpress/interactivity'`
    - `watch( () => { ... } )`
    - `unwatch()`
    - `data-wp-watch`
- Recommended Action:
    - Prefer `watch()` for observing reactive interactivity state (analytics, store-sync, side effects), add `unwatch()` cleanup to avoid leaks, and ensure build tooling includes the package.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/pull/75563
- Sources:
    - https://make.wordpress.org/core/2026/02/23/changes-to-the-interactivity-api-in-wordpress-7-0/
    - https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/

## core/router state's `url` is now server-populated

- Type: behavior-change
- Severity: low
- Applies To: multiple
- Summary: The `core/router` store's `state.url` is now initialized on the server during directive processing, so it has a stable value on first render instead of being undefined until client code sets `window.location.href`.
- Search For:
    - `store( 'core/router' ).state.url`
    - `state.url`
    - `window.location.href` (client-side initialization)
- Recommended Action:
    - Remove guards expecting `state.url` to be undefined on first load. Combine `state.url` with `watch()` or navigation hooks to detect virtual navigations and test analytics to avoid duplicate/missed pageviews.
- Related Tickets:
    - https://github.com/WordPress/wordpress-develop/pull/10944
- Sources:
    - https://make.wordpress.org/core/2026/02/23/changes-to-the-interactivity-api-in-wordpress-7-0/

## Client-side Abilities API: @wordpress/abilities and @wordpress/core-abilities

- Type: new-feature
- Severity: medium
- Applies To: plugin
- Summary: Two JS packages provide a client-side Abilities API. `@wordpress/abilities` offers registration/execution logic; `@wordpress/core-abilities` fetches server-registered abilities via `/wp-abilities/v1/` and registers them into the abilities store.
- Search For:
    - `@wordpress/abilities`
    - `@wordpress/core-abilities`
    - `registerAbility` `registerAbilityCategory` `executeAbility`
- Recommended Action:
    - Enqueue or import `@wordpress/core-abilities` in admin pages that need server abilities. For client-only abilities, import `@wordpress/abilities`. Use the abilities store API (getAbilities, getAbilityCategories) or store integration (useSelect).
- Related Tickets:
    - (none)
- Sources:
    - https://make.wordpress.org/core/2026/03/24/client-side-abilities-api-in-wordpress-7-0/
    - https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/

## executeAbility enforces JSON Schema validation and permission checks

- Type: behavior-change
- Severity: medium
- Applies To: plugin
- Summary: Client-side execution validates inputs/outputs against declared JSON Schema (draft-04) and enforces permission checks. Failures return errors with codes `ability_invalid_input`, `ability_invalid_output`, or `ability_permission_denied`. REST method selection for server abilities is derived from annotations (`readonly` → GET, `destructive+idempotent` → DELETE, else POST).
- Search For:
    - `ability_invalid_input` `ability_invalid_output` `ability_permission_denied`
    - `input_schema` `output_schema` `permissionCallback` `meta.annotations.readonly`
- Recommended Action:
    - Add JSON Schema definitions for abilities exposed to clients, test valid/invalid flows, catch and handle new error codes in client code, and verify HTTP method mappings for server abilities.
- Related Tickets:
    - https://github.com/WordPress/ai/issues/346
    - https://github.com/WordPress/gutenberg/pull/77029
- Sources:
    - https://make.wordpress.org/core/2026/03/24/client-side-abilities-api-in-wordpress-7-0/

## Connectors API and public registry functions

- Type: new-feature
- Severity: medium
- Applies To: plugin, site
- Summary: A Connectors API includes a registry singleton and public functions (`wp_is_connector_registered()`, `wp_get_connector()`, `wp_get_connectors()`) available after `init`. Plugins can register or override connectors on `wp_connectors_init`.
- Search For:
    - `wp_connectors_init`
    - `wp_get_connector`
    - `wp_get_connectors`
    - `WP_Connector_Registry`
- Recommended Action:
    - Use the public functions outside `init`; register/override connectors only during `wp_connectors_init` using registry methods.
- Related Tickets:
    - (none)
- Sources:
    - https://make.wordpress.org/core/2026/03/18/introducing-the-connectors-api-in-wordpress-7-0/
    - https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/

## New server-side AI API: wp_ai_client_prompt() and WP_AI_Client_Prompt_Builder

- Type: new-feature
- Severity: medium
- Applies To: plugin
- Summary: WordPress 7.0 adds a provider-agnostic AI client and `wp_ai_client_prompt()` which returns a fluent `WP_AI_Client_Prompt_Builder` for text/image generation and metadata-rich results.
- Search For:
    - `wp_ai_client_prompt`
    - `WP_AI_Client_Prompt_Builder`
    - `generate_text()` `generate_images()` `generate_*_result()`
- Recommended Action:
    - Replace direct SDK calls with `wp_ai_client_prompt()`, handle `WP_Error` returns, and use `is_supported_for_*()` checks to gate UI.
- Related Tickets:
    - https://core.trac.wordpress.org/ticket/64591
- Sources:
    - https://make.wordpress.org/core/2026/03/24/introducing-the-ai-client-in-wordpress-7-0/
    - https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/

## wp_ai_client_prevent_prompt filter can block prompts and change UI visibility

- Type: behavior-change
- Severity: medium
- Applies To: plugin
- Summary: The `wp_ai_client_prevent_prompt` filter can prevent prompts from executing; when prevented, no provider call is made, `is_supported_for_*()` returns false, and generation methods return a `WP_Error`.
- Search For:
    - `wp_ai_client_prevent_prompt`
- Recommended Action:
    - Check `is_supported_for_*()` before showing AI UI and handle `WP_Error` returns from generation methods; provide fallbacks and surface clear messaging when prompts are blocked.
- Related Tickets:
    - (none)
- Sources:
    - https://make.wordpress.org/core/2026/03/24/introducing-the-ai-client-in-wordpress-7-0/

## theme.json supports pseudo-class selectors on blocks and variations

- Type: new-feature
- Severity: low
- Applies To: theme
- Summary: theme.json can declare interactive pseudo-class rules (`:hover`, `:focus`, `:focus-visible`, `:active`) for blocks and block style variations; other pseudo-selectors are ignored.
- Search For:
    - `theme.json "styles": { "blocks"`
    - `":hover"` `":focus"` `":focus-visible"` `":active"`
- Recommended Action:
    - Add pseudo-state rules in theme.json for blocks that need interactive states and test editor and front-end rendering. Keep CSS fallbacks for unsupported selectors.
- Related Tickets:
    - https://core.trac.wordpress.org/ticket/64263
- Sources:
    - https://make.wordpress.org/core/2026/03/09/pseudo-element-support-for-blocks-and-their-variations-in-theme-json/
