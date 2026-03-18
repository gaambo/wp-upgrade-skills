# Breaking Changes

## get_adjacent_post() adds ID tiebreaker to SQL, breaking naive WHERE replacements
- Type: breaking-change
- Severity: high
- Applies To: multiple
- Summary: `get_adjacent_post()` SQL now includes an ID-based tiebreaker and orders by `p.post_date, p.ID`; filters that perform simple string replacements of `$post->post_date` in `get_{next|previous}_post_where` can leave the ID comparison unchanged, causing repeated results or infinite loops.
- Search For:
  - `get_{next|previous}_post_where`
  - `get_adjacent_post()`
  - `AND p.ID`
  - `ORDER BY p.post_date DESC, p.ID DESC`
  - string replacements of `$post->post_date` in `where` clauses
- Recommended Action:
  - Audit filters on `get_{next|previous}_post_where` and update replacements to handle the ID comparison (use regex like `/AND p\.ID (<|>) \d+/` or programmatically produce a correct WHERE fragment).
  - Prefer returning a safe, complete WHERE fragment instead of brittle string replaces; add runtime guards for older WP versions if needed and test with posts sharing identical `post_date`.
- Sources:
  - https://make.wordpress.org/core/2025/12/10/adjacent-post-navigation-changes-in-wordpress-6-9-and-compatibility-issues/
  - https://make.wordpress.org/core/2025/11/25/wordpress-6-9-field-guide/

## Script modules and styles must be explicitly marked for client-side navigation
- Type: breaking-change
- Severity: high
- Applies To: plugin | theme | multiple
- Summary: Client-side navigation replaces stylesheets and loads script modules on navigation; only modules explicitly marked compatible with client navigation will be imported during navigation (regular scripts are unsupported), and importmaps are supported.
- Search For:
  - `supports.interactivity` in `block.json`
  - `wp_register_script_module` / `wp_enqueue_script_module`
  - `data-wp-router-options` / `{"loadOnClientNavigation":true}`
  - `importmap`
- Recommended Action:
  - Mark blocks with `supports.interactivity` or `{ "clientNavigation": true }` in `block.json` and call `wp_interactivity()->add_client_navigation_support_to_script_module()` for manually registered modules before enqueueing.
  - Ensure modules are registered as script modules, add importmap entries for dependencies, and test client-side navigation/prefetch behavior.
- Sources:
  - https://make.wordpress.org/core/2025/11/12/interactivity-apis-client-navigation-improvements-in-wordpress-6-9/

## IE conditional comment support for enqueued scripts/styles removed
- Type: breaking-change
- Severity: high
- Applies To: multiple
- Summary: The `conditional` argument for `wp_enqueue_script()` / `wp_enqueue_style()` (IE conditional comments) is removed — `conditional` is ignored at runtime and a deprecation notice is emitted under `WP_DEBUG`.
- Search For:
  - uses of the `conditional` argument in `wp_enqueue_script(` / `wp_enqueue_style(`
  - HTML conditional comments `<!--[if` or `<![endif]-->` in themes
- Recommended Action:
  - Remove `conditional` usage; enqueue assets unconditionally or gate them with modern feature-detection; ensure dependent assets are enqueued explicitly or bundled; run with `WP_DEBUG=true` to surface deprecation notices.
- Sources:
  - https://make.wordpress.org/core/2025/11/19/legacy-internet-explorer-code-removed/
  - https://make.wordpress.org/core/2025/11/25/wordpress-6-9-field-guide/

## block.json schema validation now requires `apiVersion: 3`
- Type: breaking-change
- Severity: high
- Applies To: multiple
- Summary: The `block.json` schema in 6.9 only allows `apiVersion: 3` for new/updated blocks; manifests using `apiVersion` 1 or 2 will fail schema validation (build/CI failures and editor migration warnings).
- Search For:
  - `block.json`
  - `apiVersion: 3`
  - schema validation errors referencing `apiVersion`
- Recommended Action:
  - Update all `block.json` files to declare `"apiVersion": 3`, migrate code to the v3 block API, and run local schema validation/CI to catch failures.
- Sources:
  - https://make.wordpress.org/core/2025/11/12/preparing-the-post-editor-for-full-iframe-integration/
  - https://make.wordpress.org/core/2025/11/25/wordpress-6-9-field-guide/

## Removal of legacy Flash artifacts (SWFObject and SWFUpload)
- Type: breaking-change
- Severity: medium
- Applies To: plugin, theme
- Summary: Bundled Flash-related libraries `SWFObject` and `SWFUpload` were removed from core; code expecting them will no longer find these scripts.
- Search For:
  - `SWFObject`
  - `SWFUpload`
- Recommended Action:
  - Remove or replace dependencies on these libraries with modern JS alternatives, vendor a replacement, and test admin/editor screens that relied on those scripts.
- Sources:
  - https://make.wordpress.org/core/2025/11/17/miscellaneous-developer-focused-changes-in-6-9/
  - https://make.wordpress.org/core/2025/11/25/wordpress-6-9-field-guide/

## `set_modifiable_text()` rejects SCRIPT contents that include `<script` or `</script`
- Type: breaking-change
- Severity: medium
- Applies To: plugin
- Summary: Calls that update SCRIPT element content via `set_modifiable_text()` will be rejected if the content contains `<script` or `</script`, to prevent unsafe script-data states.
- Search For:
  - `set_modifiable_text(`
  - code that programmatically replaces `<script>` text nodes
- Recommended Action:
  - Avoid embedding literal `<script`/`</script` sequences in script text nodes; serialize/escape such strings (e.g., JSON-encode in server output and decode client-side) or use other safe transport mechanisms.
- Sources:
  - https://make.wordpress.org/core/2025/11/21/updates-to-the-html-api-in-6-9/

## Emoji detection loader converted to inline script module; settings moved to application/json
- Type: breaking-change
- Severity: medium
- Applies To: plugin | theme | site
- Summary: The emoji detection loader is now an inline script module printed in the footer and its settings are exported as an `application/json` script instead of populating `_wpemojiSettings` globally before `DOMContentLoaded`; direct reliance on `_wpemojiSettings` timing will break.
- Search For:
  - `print_emoji_detection_script`
  - `wp-emoji-settings`
  - `_wpemojiSettings`
- Recommended Action:
  - Replace code expecting `_wpemojiSettings` before `DOMContentLoaded` with runtime JSON reads (e.g., `document.getElementById('wp-emoji-settings')` + `JSON.parse()`), or remove the emoji loader after testing.
- Sources:
  - https://make.wordpress.org/core/2025/11/18/wordpress-6-9-frontend-performance-field-guide/
