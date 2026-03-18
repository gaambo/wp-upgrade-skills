# Core API

## New salted cache helpers: `wp_cache_*_salted`
- Type: new-feature
- Severity: low
- Applies To: plugin | theme | site
- Summary: New pluggable salted cache helpers (`wp_cache_get_salted`, `wp_cache_set_salted`, `wp_cache_get_multiple_salted`, `wp_cache_set_multiple_salted`) let code read/write query caches without embedding salts into key names.
- Search For:
  - `wp_cache_get_salted`
  - `wp_cache_set_salted`
- Recommended Action:
  - Prefer these functions for query-group caches; feature-detect (`function_exists`) when supporting older WP versions and ensure salt arrays preserve the exact order core expects.
- Sources:
  - https://make.wordpress.org/core/2025/11/17/consistent-cache-keys-for-query-groups-in-wordpress-6-9/

## Stricter UTF‑8 validation and use of replacement character (U+FFFD)
- Type: behavior-change
- Severity: medium
- Applies To: multiple
- Summary: The UTF‑8 pipeline enforces stricter validation and normalizes invalid subsequences to the replacement character; code manipulating raw bytes or non–multibyte-safe slicing may behave differently.
- Search For:
  - `seems_utf8(`
  - `invalid UTF-8`
  - `replacement character` U+FFFD
- Recommended Action:
  - Use multibyte-safe functions (mb_*/WP UTF-8 utilities), validate and normalize inputs, and add tests for non‑ASCII or malformed inputs.
- Sources:
  - https://make.wordpress.org/core/2025/11/18/modernizing-utf-8-support-in-wordpress-6-9/

## `WP_HTML_Processor::serialize_token()` made public
- Type: new-feature
- Severity: low
- Applies To: multiple
- Summary: Token serialization helper is public, enabling safer extraction of normalized outer/inner HTML fragments via the HTML API.
- Search For:
  - `WP_HTML_Processor::serialize_token`
- Recommended Action:
  - Replace fragile string-manipulation approaches with the HTML Processor API for normalized fragments.
- Sources:
  - https://make.wordpress.org/core/2025/11/21/updates-to-the-html-api-in-6-9/

## New dataset name helpers: `wp_js_dataset_name()` and `wp_html_custom_data_attribute_name()`
- Type: new-feature
- Severity: low
- Applies To: plugin
- Summary: Helpers map between HTML `data-*` attribute names and JavaScript `.dataset` names to remove ambiguity.
- Search For:
  - `wp_js_dataset_name(`
  - `wp_html_custom_data_attribute_name(`
- Recommended Action:
  - Use `wp_html_custom_data_attribute_name()` when emitting `data-` attributes that will be read via `.dataset` and `wp_js_dataset_name()` for server-side validation/documentation.
- Sources:
  - https://make.wordpress.org/core/2025/11/21/updates-to-the-html-api-in-6-9/

## New streaming block parser: `WP_Block_Processor`
- Type: new-feature
- Severity: medium
- Applies To: multiple
- Summary: `WP_Block_Processor` parses HTML incrementally (streaming) exposing parsed JSON/attributes and reducing memory usage for very large posts.
- Search For:
  - `WP_Block_Processor`
  - `streaming block parser`
- Recommended Action:
  - Consider replacing ad-hoc parsing with `WP_Block_Processor` where appropriate and run parsing/serialization tests on complex content.
- Sources:
  - https://make.wordpress.org/core/2025/11/19/introducing-the-streaming-block-parser-in-wordpress-6-9/
  - https://make.wordpress.org/core/2025/11/25/wordpress-6-9-field-guide/

## `wp_kses()` preserves escaped numeric references and allows additional HTML5 semantic tags
- Type: behavior-change
- Severity: medium
- Applies To: multiple
- Summary: `wp_kses()` no longer unescapes escaped numeric character references for users without `unfiltered_html` and now allows additional HTML5 semantic tags/attributes.
- Search For:
  - `wp_kses(`
- Recommended Action:
  - Test sanitization flows and update expectations where code relied on prior unescaping or stricter tag blocking.
- Sources:
  - https://make.wordpress.org/core/2025/11/21/updates-to-the-html-api-in-6-9/

## `get_url_in_content()` returns decoded `href`
- Type: behavior-change
- Severity: medium
- Applies To: multiple
- Summary: The link-detection helper now returns decoded `href` values (not raw-encoded strings).
- Search For:
  - `get_url_in_content(`
- Recommended Action:
  - Audit consumers expecting encoded URLs; re-encode where needed (`rawurlencode()`/`esc_url()`) and add tests for URL round-trips.
- Sources:
  - https://make.wordpress.org/core/2025/11/21/updates-to-the-html-api-in-6-9/

## `set_attribute()` now escapes syntax characters into character references
- Type: behavior-change
- Severity: low
- Applies To: multiple
- Summary: Attribute values set via `set_attribute()` are escaped by converting syntax characters to character references, which may change raw string representations while remaining semantically equivalent.
- Search For:
  - `set_attribute(`
- Recommended Action:
  - Prefer Processor APIs for setting attributes and use semantic HTML assertions (e.g., `assertEqualHTML()` in tests) instead of exact string matches.
- Sources:
  - https://make.wordpress.org/core/2025/11/21/updates-to-the-html-api-in-6-9/
