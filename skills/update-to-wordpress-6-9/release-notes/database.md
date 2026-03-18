# Database

## Core stops guessing source encodings — conversions require a known encoding
- Type: behavior-change
- Severity: high
- Applies To: site | plugin | theme
- Summary: Conversion into UTF‑8 only occurs when the source encoding is explicitly known; WordPress reduces reliance on guessing encodings to avoid data corruption, which can surface previously-hidden encoding issues or change corruption patterns.
- Search For:
  - `blog_charset`
  - `cp-1252`
  - `latin1`
  - `double-encoded`
- Recommended Action:
  - Ensure databases and exports declare and are converted to UTF‑8 before upgrading, validate HTTP/meta charset headers, and preview legacy content to detect and fix double-encoded or non‑UTF-8 text.
- Sources:
  - https://make.wordpress.org/core/2025/11/18/modernizing-utf-8-support-in-wordpress-6-9/

## WP_Query and query-cache key creation changed (consistent cache keys)
- Type: behavior-change
- Severity: medium
- Applies To: plugin | host
- Summary: Cache key creation for `WP_Query` (and other query groups) changed to reuse the same keys and validate by stored last-changed value rather than baking last-changed into the key; custom code that assumed older key formats may miss or duplicate cached queries.
- Search For:
  - `consistent cache keys` `WP_Query` `query cache keys`
- Recommended Action:
  - Update custom cache-key logic to use new helpers, test with your persistent object cache, and clear caches after upgrade.
- Sources:
  - https://make.wordpress.org/core/2025/11/17/consistent-cache-keys-for-query-groups-in-wordpress-6-9/
  - https://make.wordpress.org/core/2025/11/25/wordpress-6-9-field-guide/
