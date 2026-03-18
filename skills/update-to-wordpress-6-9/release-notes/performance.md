# Performance

## Query caches reuse existing keys and validate by last-changed
- Type: behavior-change
- Severity: medium
- Applies To: multiple
- Summary: Query caches stop embedding last-changed into keys; a single key is reused while cached entries store last-changed and are validated on access — reducing orphaned cache keys but changing cache-hit behavior.
- Search For:
  - `post-queries`
  - `wp_query`
  - `get_comments`
  - `get_objects_in_term`
  - `adjacent_post`
- Recommended Action:
  - Audit code that checks/sets query caches directly; prefer the new `wp_cache_*_salted` helpers and consider evicting old keys after upgrade; monitor cache-miss metrics.
- Sources:
  - https://make.wordpress.org/core/2025/11/17/consistent-cache-keys-for-query-groups-in-wordpress-6-9/

## Streaming block parser reduces memory for very large posts
- Type: new-feature
- Severity: low
- Applies To: multiple
- Summary: A streaming block parser visits tokens incrementally (pre-order traversal) to reduce memory usage for very large or programmatic posts while preserving render order.
- Search For:
  - `streaming block parser`
  - `Block Processor`
- Recommended Action:
  - Test rendering and memory usage with large/complex posts and consider migrating fragile custom parsing to the new processor.
- Sources:
  - https://make.wordpress.org/core/2025/11/19/introducing-the-streaming-block-parser-in-wordpress-6-9/

## `fetch_feed()` stores feeds as site transients on multisite
- Type: behavior-change
- Severity: medium
- Applies To: site
- Summary: On multisite, `fetch_feed()` now uses site transients (`get_site_transient`/`set_site_transient`) so a fetched feed is cached once for the network rather than per-site.
- Search For:
  - `fetch_feed(`
  - `get_site_transient(`
  - `set_site_transient(`
- Recommended Action:
  - Update plugins/themes that clear or read feed transients to use site-transient APIs on multisite and re-test feed widgets/aggregation.
- Sources:
  - https://make.wordpress.org/core/2025/11/17/miscellaneous-developer-focused-changes-in-6-9/

## Inline CSS limit increased to 40KB (inlining behavior changed)
- Type: behavior-change
- Severity: medium
- Applies To: plugin | theme | site
- Summary: `styles_inline_size_limit` default increased from 20KB to 40KB so more small stylesheets may be inlined, affecting cold-visit LCP and repeat-visit bytes.
- Search For:
  - `styles_inline_size_limit`
  - `wp_maybe_inline_styles`
- Recommended Action:
  - Test LCP and repeat-visit metrics and tune `styles_inline_size_limit` if necessary via filter.
- Sources:
  - https://make.wordpress.org/core/2025/11/18/wordpress-6-9-frontend-performance-field-guide/

## WP Cron spawn moved from `init` to `shutdown`
- Type: behavior-change
- Severity: low
- Applies To: site, plugin
- Summary: WP Cron is now spawned at `shutdown` instead of `init`, changing when cron is enqueued and avoiding `init`-time loopback delays.
- Search For:
  - `wp-cron` `spawn` `init` `shutdown`
- Recommended Action:
  - If your plugin expects cron scheduling/spawn during `init`, verify behavior; otherwise no action required.
- Sources:
  - https://make.wordpress.org/core/2025/11/18/wordpress-6-9-frontend-performance-field-guide/
