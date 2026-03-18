# Deprecated

## `data-wp-ignore` directive deprecated
- Type: deprecation
- Severity: medium
- Applies To: multiple
- Summary: The `data-wp-ignore` Interactivity API directive (which prevented hydration) is deprecated because it broke context inheritance and navigation and will be removed in a future release.
- Search For:
  - `data-wp-ignore`
- Recommended Action:
  - Remove uses of `data-wp-ignore` and refactor to server-side conditionals or redesigned interactive boundaries; add tests for hydration and context propagation.
- Sources:
  - https://make.wordpress.org/core/2025/11/12/changes-to-the-interactivity-api-in-wordpress-6-9/

## `media` entity in `@wordpress/core-data` deprecated in favor of `attachment`
- Type: deprecation
- Severity: high
- Applies To: multiple
- Summary: The `media` entity and associated selectors/actions are deprecated; use `postType` `attachment` to avoid duplicate caches and data desync.
- Search For:
  - `getMedia`, `getMediaItems`, `saveMedia`, `deleteMedia`
  - `getEntityRecord( 'root', 'media'`
- Recommended Action:
  - Migrate client-side data calls to `getEntityRecord( 'postType', 'attachment' )` and update selectors/dispatches; resolve console deprecation notices during testing.
- Sources:
  - https://make.wordpress.org/core/2025/11/25/miscellaneous-editor-changes-in-wordpress-6-9/

## `caption` shape changes when moving from `media` to `attachment` entity
- Type: deprecation
- Severity: medium
- Applies To: multiple
- Summary: `caption` returned by `getEditedEntityRecord( 'root', 'media' )` was a string; the `attachment` entity returns an object (`{ raw, rendered }`), which can break code expecting a string.
- Search For:
  - `getEditedEntityRecord( 'root', 'media'`
  - `caption.raw` `caption.rendered`
- Recommended Action:
  - Update code to read `caption.raw` or handle both shapes during migration; add tests to avoid undefined access.
- Sources:
  - https://make.wordpress.org/core/2025/11/25/miscellaneous-editor-changes-in-wordpress-6-9/

## Deprecated/non-standard `speak` and `aural` CSS replaced
- Type: deprecation
- Severity: low
- Applies To: theme | plugin
- Summary: Core replaces deprecated/non-standard `speak` and `aural` CSS handling, which may alter assistive-focused CSS rules.
- Search For:
  - `speak:`
  - `aural:`
  - `::-moz-placeholder`
- Recommended Action:
  - Update stylesheets to modern approaches (use `aria-hidden`, visually-hidden classes or real HTML content) and re-test accessibility.
- Sources:
  - https://make.wordpress.org/core/2025/11/19/accessibility-improvements-in-wordpress-6-9/
