# Editor

## Notes feature: block-level contextual notes in the post editor
- Type: new-feature
- Severity: medium
- Applies To: multiple
- Summary: Notes are block-level feedback stored as comments with `comment_type = 'note'`; they are created/viewed only inside the post editor and support replies, resolve/restore, edit/delete.
- Search For:
  - `comment_type` `note`
  - block attribute key: `metadata?.noteId`
  - REST `/wp/v2/comments?type=note`
- Recommended Action:
  - Update editor integrations and comment-related UI to surface or ignore notes explicitly; train editors that notes are editor-only and linked via block metadata.
- Sources:
  - https://make.wordpress.org/core/2025/11/15/notes-feature-in-wordpress-6-9/

## Block variation detection falls back to `isDefault`
- Type: behavior-change
- Severity: low
- Applies To: multiple
- Summary: When no `isActive` criteria match, variation detection falls back to a variation with `isDefault: true` (for `block` and `transform` scopes).
- Search For:
  - `isActive`
  - `isDefault`
- Recommended Action:
  - Review custom block variations and ensure `isDefault` is used intentionally; do not rely on `isDefault` to affect the inserter.
- Sources:
  - https://make.wordpress.org/core/2025/11/25/miscellaneous-editor-changes-in-wordpress-6-9/

## `setAttributes` accepts updater functions in Edit components
- Type: new-feature
- Severity: low
- Applies To: plugin
- Summary: `setAttributes` can accept a pure updater function receiving current attributes and returning updated attributes for safer concurrent updates.
- Search For:
  - `setAttributes( ( currentAttr ) =>`
- Recommended Action:
  - Optionally refactor attribute updates to the updater form; no migration required.
- Sources:
  - https://make.wordpress.org/core/2025/11/25/miscellaneous-editor-changes-in-wordpress-6-9/

## `SelectControl` applies class names to root element
- Type: behavior-change
- Severity: low
- Applies To: plugin | theme
- Summary: `SelectControl` now attaches `components-select-control` and any `className` to the component root rather than an internal element—CSS targeting internals may break.
- Search For:
  - `components-select-control`
  - `SelectControl className`
- Recommended Action:
  - Update CSS selectors to target the root element classes.
- Sources:
  - https://make.wordpress.org/core/2025/11/25/miscellaneous-editor-changes-in-wordpress-6-9/

## Button block: HTML element selection added
- Type: new-feature
- Severity: low
- Applies To: theme | site | plugin
- Summary: The Button block gained an "HTML Element" selection allowing authors to render different tags (e.g., `<button>` vs `<a>`), affecting semantics, styles, and JS.
- Search For:
  - `Button Block`
  - `HTML Element selection`
- Recommended Action:
  - Test theme styles and JS that target `.wp-block-button a` or `.wp-block-button button`; adjust selectors and accessibility testing accordingly.
- Sources:
  - https://make.wordpress.org/core/2025/11/19/accessibility-improvements-in-wordpress-6-9/

## Dataviews primary/bulk actions converted to text-based controls
- Type: behavior-change
- Severity: low
- Applies To: plugin | theme | site
- Summary: Primary and bulk actions in DataViews are text-based instead of icon-only; selectors and JS assumptions targeting icon-only elements may break.
- Search For:
  - `DataViews`
  - `primary action`
- Recommended Action:
  - Update CSS/JS to use stable class names or data attributes and re-test list/bulk actions.
- Sources:
  - https://make.wordpress.org/core/2025/11/19/accessibility-improvements-in-wordpress-6-9/

## Preparing editor for iframe integration: console warnings and isolation
- Type: behavior-change
- Severity: medium
- Applies To: multiple
- Summary: 6.9 emits console warnings for blocks with `apiVersion <= 2` (when `SCRIPT_DEBUG` is enabled) and prepares the editor to run in an iframe (isolation may affect style inheritance and viewport units).
- Search For:
  - `apiVersion`
  - `SCRIPT_DEBUG`
  - `iframe` `iframed Post Editor`
- Recommended Action:
  - Enable `SCRIPT_DEBUG` in development to find legacy blocks, migrate blocks to `apiVersion: 3`, and test styling/behavior in an iframe context.
- Sources:
  - https://make.wordpress.org/core/2025/11/12/preparing-the-post-editor-for-full-iframe-integration/
  - https://make.wordpress.org/core/2025/11/25/wordpress-6-9-field-guide/

## Focus management and screen reader notifications adjusted
- Type: behavior-change
- Severity: low
- Applies To: plugin | theme | site
- Summary: Multiple focus/announcement fixes change focus timing and screen reader notices across admin and Gutenberg; code relying on previous focus timing may observe different targets.
- Search For:
  - `focusOnMount`
  - `focus lost`
  - `snackbar`
  - ticket numbers: 69609, 69813, 70192, 69520
- Recommended Action:
  - Test keyboard navigation, dialogs, and custom panels; prefer provided focus APIs and avoid brittle timing hacks.
- Sources:
  - https://make.wordpress.org/core/2025/11/19/accessibility-improvements-in-wordpress-6-9/
