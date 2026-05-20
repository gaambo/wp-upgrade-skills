# Admin

## Core enqueues @wordpress/core-abilities in admin by default

- Type: behavior-change
- Severity: low
- Applies To: plugin
- Summary: Core now enqueues `@wordpress/core-abilities` on all admin (and super-admin) pages so server-registered abilities are available by default; plugins that register server abilities don't need extra client setup for standard admin pages.
- Search For:
    - `wp_enqueue_script_module( '@wordpress/core-abilities' )`
    - `wp_register_ability` `wp_register_ability_category`
- Recommended Action:
    - Avoid duplicating client registrations for server-registered abilities in admin pages; only enqueue `@wordpress/core-abilities` where server abilities must be available outside default admin pages (front-end, custom admin routes).
- Related Tickets:
    - (none)
- Sources:
    - https://make.wordpress.org/core/2026/03/24/client-side-abilities-api-in-wordpress-7-0/

## Credential management moved to Connectors API / Settings > Connectors

- Type: behavior-change
- Severity: medium
- Applies To: plugin | site
- Summary: API keys and provider credentials are now managed by the Connectors API and surfaced in Settings > Connectors. Plugin authors no longer need to implement credential storage for supported providers.
- Search For:
    - `Connectors API`
    - `Settings > Connectors`
    - provider registration
- Recommended Action:
    - Remove custom credential storage for registered AI providers and integrate with the Connectors API. Use the Connectors admin UI for key management and rely on Core for transport/integration.
- Related Tickets:
    - (none)
- Sources:
    - https://make.wordpress.org/core/2026/03/24/introducing-the-ai-client-in-wordpress-7-0/

## View transitions respect OS reduced motion preference (admin)

- Type: behavior-change
- Severity: low
- Applies To: site | theme
- Summary: WP‑Admin view transitions only activate when the OS reduced motion preference is not set; animations are suppressed for users who prefer reduced motion.
- Search For:
    - `view transitions`
    - `reduced motion`
- Recommended Action:
    - If admin customizations relied on view-transition side effects, add reduced-motion checks and provide accessible fallbacks where necessary.
- Related Tickets:
    - https://core.trac.wordpress.org/ticket/64529
- Sources:
    - https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/
