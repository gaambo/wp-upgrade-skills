# Database

## Connector API credential resolution and storage behavior; keys not encrypted

- Type: behavior-change
- Severity: high
- Applies To: plugin, site
- Summary: For `api_key` connectors, WordPress resolves credentials in priority: environment variable → PHP constant → database setting. Database-stored API keys are not encrypted (masked in UI only) and any plugin/site code can access provided keys.
- Search For:
    - `connectors_ai_{$provider_id}_api_key`
    - `{PROVIDER_ID}_API_KEY`
    - environment variable, PHP constant, database
- Recommended Action:
    - Avoid assuming connector keys are scoped to a single plugin; document opt-in usage and advise administrators to use environment variables or PHP constants in sensitive deployments. Consider permission checks in your plugin before using a site-level connector key.
- Related Tickets:
    - https://core.trac.wordpress.org/ticket/64789
- Sources:
    - https://make.wordpress.org/core/2026/03/18/introducing-the-connectors-api-in-wordpress-7-0/
