# Admin

## Menu quick-search now queries only post titles
- Type: behavior-change
- Severity: medium
- Applies To: multiple
- Summary: The Menus screen quick-search adds `search_columns => array('post_title')` to WP_Query args, so searches match `post_title` only rather than full-text content.
- Search For:
  - `wp_ajax_menu_quick_search_args`
  - `search_columns`
  - `apply_filters( 'wp_ajax_menu_quick_search_args', $query_args )`
- Recommended Action:
  - Audit plugins that rely on the Menus "Add item" search; add a filter on `wp_ajax_menu_quick_search_args` to modify or remove `search_columns` if full-text behavior is required and re-test menu item discovery.
- Sources:
  - https://make.wordpress.org/core/2025/11/19/admin-menu-search-query-changed/

## Admin menu search now reads from `$_GET` not raw `QUERY_STRING`
- Type: behavior-change
- Severity: low
- Applies To: plugin, site
- Summary: Admin menu search uses `$_GET` instead of `$_SERVER['QUERY_STRING']`, making search behavior more predictable for extensions that parse query strings.
- Search For:
  - `$_SERVER['QUERY_STRING']` `admin menu` `menu search`
- Recommended Action:
  - Update extensions that read raw query strings to use `$_GET` and re-test admin search behavior.
- Sources:
  - https://make.wordpress.org/core/2025/11/25/wordpress-6-9-field-guide/

## Notes stored as comments: query, status, and protections changes
- Type: behavior-change
- Severity: medium
- Applies To: plugin | theme | site
- Summary: Notes are implemented as `WP_Comment` with `type='note'` and are excluded by default from `get_comments()` and REST unless `type` is set; notes use `comment_status` mapping (0 hold, 1 approve, trash/delete) and bypass some comment posting protections and filters.
- Search For:
  - `get_comments( array( 'post_id' => $post_id ) )` (will not return notes)
  - `get_comments( array( 'type' => 'note' ) )`
  - `pre_comment_approved`
  - `notify_post_author`
  - `EMPTY_TRASH_DAYS`
- Recommended Action:
  - Explicitly request `type => 'note'` when reading notes, handle `hold`/`approve`/`trash` statuses correctly, and add protections/filters for `comment_type === 'note'` if your code depends on flood/duplicate/comment filters.
- Sources:
  - https://make.wordpress.org/core/2025/11/15/notes-feature-in-wordpress-6-9/
