# Editor

## Client-side hook to replace the RTC sync transport (`sync.providers`)

- Type: new-feature
- Severity: medium
- Applies To: multiple
- Summary: A `sync.providers` client-side filter lets plugins replace the default HTTP-polling real-time sync transport with custom provider creators (e.g., WebSocket-based). Providers must be async creator functions that return objects implementing `destroy()` and `on(event, callback)`.
- Search For:
    - `sync.providers`
    - `addFilter( 'sync.providers'`
    - `async ( { objectType, objectId, ydoc, awareness } )`
- Recommended Action:
    - Implement a ProviderCreator matching the signature if replacing the default; ensure returned provider implements `destroy()` and `on()` and emits `{ status: 'connecting'|'connected'|'disconnected', error?: ... }`. Test lifecycle and multi-collaborator scenarios.
- Related Tickets:
    - https://github.com/yjs/y-websocket
    - https://github.com/yjs/y-websocket-server
- Sources:
    - https://make.wordpress.org/core/2026/04/01/building-a-custom-sync-provider-for-real-time-collaboration/
    - https://make.wordpress.org/core/2026/03/10/real-time-collaboration-in-the-block-editor/

## Custom sync providers must implement robust auth and per-document authorization

- Type: behavior-change
- Severity: high
- Applies To: multiple
- Summary: Custom transports operating outside WordPress must implement short‑lived token issuance, server-side token validation on every connection, per-document authorization checks, token rotation on reconnect, and emit disconnected events with error codes for the editor to surface feedback.
- Search For:
    - `/my-plugin/v1/sync/auth`
    - `provider.params = { auth: data.token }`
    - `emit { status: 'disconnected', error }`
- Recommended Action:
    - Provide a REST endpoint issuing short-lived tokens tied to user and entity; validate tokens and permissions on the sync server for every connection; rotate tokens and map close codes to meaningful editor errors. Reference VIP real-time collaboration and y-websocket servers.
- Related Tickets:
    - https://github.com/Automattic/vip-real-time-collaboration
- Sources:
    - https://make.wordpress.org/core/2026/04/01/building-a-custom-sync-provider-for-real-time-collaboration/

## Per-instance Custom CSS for blocks (block support `customCSS`)

- Type: new-feature
- Severity: medium
- Applies To: multiple
- Summary: `supports.customCSS` adds a "Custom CSS" field in the block inspector for editors with `edit_css`. CSS is stored in the block `style.css`, a hashed class `wp-custom-css-<hash>` plus `has-custom-css` is added to output, and a generated stylesheet `#wp-block-custom-css` is enqueued after `global-styles`.
- Search For:
    - `customCSS`
    - `"style":{"css":"`
    - `has-custom-css`
    - `wp-custom-css-`
    - `id="wp-block-custom-css"`
- Recommended Action:
    - For blocks that shouldn't expose per-instance CSS (raw/opaque output or no reliable outer element) set `supports.customCSS: false`. For server-rendered blocks ensure a standard outermost element to apply the class. Test CSS specificity and ordering relative to Global Styles and capabilities (`edit_css`) gating.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/issues/56127
    - https://github.com/WordPress/gutenberg/pull/73959
- Sources:
    - https://make.wordpress.org/core/2026/03/15/custom-css-for-individual-block-instances-in-wordpress-7-0/

## width/height added as standard block supports (`supports.dimensions.width` / `supports.dimensions.height`)

- Type: new-feature
- Severity: medium
- Applies To: multiple
- Summary: Blocks can opt into built-in width and height controls via `supports.dimensions.width` and/or `supports.dimensions.height`. Themes can provide defaults in `styles.blocks.{blockName}.dimensions.{width|height}` and disable globally via `settings.dimensions.{width|height}`.
- Search For:
    - `supports.dimensions.width`
    - `supports.dimensions.height`
    - `styles.blocks.*.dimensions`
- Recommended Action:
    - Add `supports.dimensions` in block.json for blocks that should expose controls, set theme defaults in theme.json, and consider migrating custom implementations to this support to reduce duplication. Verify serialization behavior.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/pull/71905
- Sources:
    - https://make.wordpress.org/core/2026/03/15/dimensions-support-enhancements-in-wordpress-7-0/

## Post editor iframing decided per-post by inserted blocks' apiVersion

- Type: behavior-change
- Severity: medium
- Applies To: multiple
- Summary: The editor decides whether to load in an iframe based on the API version of blocks actually inserted in the post: if every inserted block is API v3+ the editor loads inside an iframe; otherwise it loads without an iframe. This affects the runtime environment per-post and when blocks are inserted/removed.
- Search For:
    - `"apiVersion": 3`
    - `"apiVersion": 2`
    - `registerBlockType(`
- Recommended Action:
    - Update blocks to API v3 when possible and test blocks inside and outside an iframe. Audit assumptions about globals and DOM used by plugins/themes and adapt to both iframe and non-iframe contexts.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/pull/75187
- Sources:
    - https://make.wordpress.org/core/2026/02/24/iframed-editor-changes-in-wordpress-7-0/
    - https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/

## PHP-only block registration via `supports.autoRegister`

- Type: new-feature
- Severity: medium
- Applies To: plugin | theme | site | multiple
- Summary: `register_block_type()` supports `'supports' => ['autoRegister' => true]` to register simple server-rendered blocks in PHP only (with a `render_callback`) and expose them in the editor without client-side JS registration. The editor auto-generates Inspector controls for supported attribute types.
- Search For:
    - `register_block_type.*autoRegister`
    - `supports' => array( 'autoRegister' => true`
    - `render_callback`
- Recommended Action:
    - For simple server-rendered blocks, use `supports.autoRegister` and provide a `render_callback`. Limit attributes to supported types for auto-generated controls and fall back to JS registration for complex editor experiences.
- Related Tickets:
    - https://core.trac.wordpress.org/ticket/64639
- Sources:
    - https://make.wordpress.org/core/2026/03/03/php-only-block-registration/
    - https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/

## Pattern editing: unsynced patterns and template parts default to contentOnly editing

- Type: behavior-change
- Severity: medium
- Applies To: multiple
- Summary: Unsynced patterns and template parts inserted into the editor are treated as `contentOnly` (section) blocks by default, showing only content attributes and hiding deeper block structure or style controls.
- Search For:
    - `contentOnly`
    - `patternName`
    - `section blocks`
- Recommended Action:
    - Test registered patterns and template parts in the editor. If you need inner-block editing, set `allowedBlocks` or opt out site-wide with `disableContentOnlyForUnsyncedPatterns` (filter `block_editor_settings_all`) or the provided JS settings updater.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/issues/71517
    - https://github.com/WordPress/gutenberg/pull/75457
- Sources:
    - https://make.wordpress.org/core/2026/03/15/pattern-editing-in-wordpress-7-0/

## Pattern Overrides now work for custom blocks via Block Bindings (opt-in)

- Type: new-feature
- Severity: medium
- Applies To: plugin | theme | site | multiple
- Summary: Pattern Overrides were extended to custom blocks using Block Bindings. Servers must opt-in attributes via the `block_bindings_supported_attributes` filter; bindings supply attribute values to dynamic blocks' `render_callback` and map persisted markup for static blocks.
- Search For:
    - `block_bindings_supported_attributes`
    - `render_callback`
    - `render_block` filter
- Recommended Action:
    - Opt-in server-side by adding attributes to `block_bindings_supported_attributes`. For static blocks with unsourced attributes, implement a `render_callback()` or `render_block` filter to apply bound values.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/pull/73889
- Sources:
    - https://make.wordpress.org/core/2026/03/16/pattern-overrides-in-wp-7-0-support-for-custom-blocks/
    - https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/
