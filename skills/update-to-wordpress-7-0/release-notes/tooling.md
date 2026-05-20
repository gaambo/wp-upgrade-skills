# Tooling

## wordpress/wp-ai-client package behavior on 7.0 — PHP SDK disabled, REST/JS remain

- Type: tooling
- Severity: low
- Applies To: plugin
- Summary: The `wordpress/wp-ai-client` package auto-detects WP 7.0+ and disables its own PHP SDK parts (Core now provides them) while continuing to expose REST endpoints and the JavaScript client. The package may be discontinued and REST/JS behavior moved upstream.
- Search For:
    - `wordpress/wp-ai-client`
    - `UPGRADE.md`
- Recommended Action:
    - If you relied only on the PHP SDK, remove the package when requiring WP 7.0+. If you need the REST endpoints or the JS client, keep the package for now and track upstream changes; plan to migrate when functionality is moved to Gutenberg/Core.
- Related Tickets:
    - https://github.com/WordPress/wp-ai-client/blob/trunk/UPGRADE.md
    - https://make.wordpress.org/core/2026/02/03/proposal-for-merging-wp-ai-client-into-wordpress-7-0/
- Sources:
    - https://make.wordpress.org/core/2026/03/24/introducing-the-ai-client-in-wordpress-7-0/
