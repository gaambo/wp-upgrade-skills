# Editor

## Client-side `sync.providers` filter allows custom real-time sync transports

- Type: new-feature
- Severity: medium
- Applies To: multiple
- Summary: `sync.providers` client filter lets plugins replace the default HTTP-polling transport with custom Yjs-compatible providers (e.g., WebSocket providers). Provider creators are async functions receiving `{ objectType, objectId, ydoc, awareness }` and must return `{ destroy(), on(event, cb) }`.
- Search For:
    - sync.providers
    - addFilter( 'sync.providers'
    - provider creator signature: `{ objectType, objectId, ydoc, awareness }`
    - destroy(), on( event, callback )
- Recommended Action:
    - Implement a provider creator matching the documented signature and register via `addFilter('sync.providers', ...)`.
    - Ensure the provider emits status events and implements `destroy()` to clean up connections.
    - Test lifecycle and reconnection behavior.
- Related Tickets:
    - (none)
- Sources:
    - https://make.wordpress.org/core/2026/04/01/building-a-custom-sync-provider-for-real-time-collaboration/
    - https://make.wordpress.org/core/2026/03/10/real-time-collaboration-in-the-block-editor/

## Responsibility for auth and authorization moves to provider infrastructure

- Type: behavior-change
- Severity: high
- Applies To: multiple
- Summary: Custom sync providers connect to external infrastructure; WordPress will not proxy or authorize those connections. The sync server must validate tokens, verify document permissions, rotate short-lived tokens, and surface connection errors for the editor to display.
- Search For:
    - token, auth, provider.params = { auth: data.token }
    - apiFetch( { path: '/my-plugin/v1/sync/auth' } )
    - status: 'disconnected', error
- Recommended Action:
    - Implement a REST endpoint issuing short-lived, document-scoped tokens and validate them on the sync server for every connection.
    - Map close codes to editor-visible error types and emit `{ status: 'disconnected', error }`.
- Related Tickets:
    - https://github.com/Automattic/vip-real-time-collaboration
- Sources:
    - https://make.wordpress.org/core/2026/04/01/building-a-custom-sync-provider-for-real-time-collaboration/

## Real-time collaboration is disabled when classic meta boxes are present

- Type: behavior-change
- Severity: high
- Applies To: plugin
- Summary: The block editor's real-time collaboration will disable collaboration on a post if classic meta boxes are detected to avoid unsynced data loss.
- Search For:
    - register_post_meta
    - show_in_rest
    - "meta boxes" "classic meta box"
- Recommended Action:
    - Migrate meta box data to registered post meta with `show_in_rest: true` and proper types/revision settings.
    - Replace meta box UIs with block-based or sidebar implementations that use the editor data store.
    - Test collaborative editing after migration.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/pull/68483
- Sources:
    - https://make.wordpress.org/core/2026/03/10/real-time-collaboration-in-the-block-editor/

## Custom block support "customCSS" — per-instance Custom CSS input in block inspector

- Type: new-feature
- Severity: medium
- Applies To: multiple
- Summary: New block support `customCSS` adds a "Custom CSS" field in the Advanced panel for block instances (visible only to users with `edit_css`). Enabled by default; authors can opt out via `block.json`.
- Search For:
    - "supports\": {\"customCSS\""
    - `"customCSS": false`
    - "Custom CSS" (block inspector UI)
- Recommended Action:
    - If a block must not expose per-instance CSS, add `"customCSS": false` to `supports` in `block.json`.
    - Audit block UIs and documentation and test roles without `edit_css`.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/issues/56127
- Sources:
    - https://make.wordpress.org/core/2026/03/15/custom-css-for-individual-block-instances-in-wordpress-7-0/

## Dimensions support: supports.dimensions.width and supports.dimensions.height

- Type: new-feature
- Severity: low
- Applies To: multiple
- Summary: Blocks can opt in to standardized width/height controls via `supports.dimensions.width` and `supports.dimensions.height`; themes may set defaults in `styles.blocks.{name}.dimensions.{width|height}` and define named presets under `settings.dimensions.dimensionSizes`.
- Search For:
    - "supports.dimensions.width"
    - "supports.dimensions.height"
    - "settings.dimensions.dimensionSizes"
- Recommended Action:
    - Block authors: opt in by adding `supports.dimensions` entries or keep custom controls.
    - Theme authors: define `styles.blocks.{name}.dimensions.*` or `settings.dimensions.dimensionSizes` as needed.
    - Test UI behavior and presets for <8 vs >=8 presets.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/pull/71905
    - https://github.com/WordPress/gutenberg/pull/71914
- Sources:
    - https://make.wordpress.org/core/2026/03/15/dimensions-support-enhancements-in-wordpress-7-0/

## Pattern editing: unsynced patterns and template parts default to contentOnly; listView and opt-out setting

- Type: behavior-change / new-feature
- Severity: high (behavior-change) / low (new-feature)
- Applies To: multiple
- Summary: Unsynced patterns/template parts default to `contentOnly` editing (hiding non-content blocks from List View and making them non-selectable). New `listView` block support adds a List View UI for container blocks. Sites may opt out of contentOnly for unsynced patterns via `disableContentOnlyForUnsyncedPatterns`.
- Search For:
    - contentOnly
    - `"role": "content"`
    - "listView"
    - disableContentOnlyForUnsyncedPatterns
- Recommended Action:
    - Audit patterns/template parts to ensure editable content remains reachable in `contentOnly` mode.
    - For container blocks that require a list UI, add `supports: { "listView": true }` in `block.json`.
    - If full-edit behavior is required for unsynced patterns, set `disableContentOnlyForUnsyncedPatterns` via the `block_editor_settings_all` filter or via JS updateSettings.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/issues/73775
    - https://github.com/WordPress/gutenberg/issues/71517
    - https://github.com/WordPress/gutenberg/pull/75457
- Sources:
    - https://make.wordpress.org/core/2026/03/15/pattern-editing-in-wordpress-7-0/

## Pattern Overrides can target custom blocks that opt into Block Bindings

- Type: new-feature
- Severity: medium
- Applies To: multiple
- Summary: Pattern Overrides may target any block attributes that opt into Block Bindings. Dynamic blocks receive bound values in render callbacks; static blocks use the HTML API to replace sourced attributes in persisted markup.
- Search For:
    - block_bindings_supported_attributes
    - "Pattern Overrides"
    - render_callback
    - render_block
- Recommended Action:
    - Opt custom blocks into overrides by adding their attribute names to the server-side `block_bindings_supported_attributes` filter.
    - If static blocks can't be parsed by the HTML API, implement `render_callback()` or use `render_block` to inject values server-side.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/pull/73889
- Sources:
    - https://make.wordpress.org/core/2026/03/16/pattern-overrides-in-wp-7-0-support-for-custom-blocks/

## DataViews / DataForm editor features and validation changes

- Type: new-feature / behavior-change
- Severity: low–medium
- Applies To: plugin
- Summary: DataViews adds field `format` options for numbers/dates, `getValueFormatted` overrides, extended `isValid` rules (`pattern`, `minLength`, `maxLength`, `min`, `max`), new edit controls (`markWhenOptional`, `combobox`, `adaptiveSelect`), `onReset` prop for Reset view behaviour, CSS custom property `--wp-dataviews-color-background`, layout enhancements (`details`, `panel.editVisibility`, `card.isCollapsible`), and `pickerTable` layout for pickers.
- Search For:
    - format:, getValueFormatted
    - isValid:, pattern, minLength, maxLength, min, max
    - markWhenOptional, combobox, adaptiveSelect
    - onReset, "Reset view"
    - --wp-dataviews-color-background
    - layout: { type: 'details' }, editVisibility, isCollapsible
    - type: 'pickerTable'
- Recommended Action:
    - Use `format` and `getValueFormatted` for localized display; test localization and WP settings interactions.
    - Add stricter `isValid` rules where appropriate and verify UI/server validation interplay.
    - Use `combobox`/`adaptiveSelect` for large option sets and test accessibility.
    - Provide `onReset` if persisted views require reset behavior.
    - Use the CSS custom property for theme-consistent backgrounds.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/issues/73076
- Sources:
    - https://make.wordpress.org/core/2026/03/04/dataviews-dataform-et-al-in-wordpress-7-0/
