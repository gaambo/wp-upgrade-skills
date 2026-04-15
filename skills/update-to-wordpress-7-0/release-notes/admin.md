# Admin

## Settings → Connectors admin screen and API key management rules

- Type: new-feature
- Severity: medium
- Applies To: site | plugin
- Summary: New Settings → Connectors screen lists connectors and shows API key source and connection status for `api_key` connectors. Authentication supports `api_key` and `none`. For `api_key` connectors, credentials are checked in order: environment variable → PHP constant → database. DB-stored keys use setting names like `connectors_{$provider_type}_{$provider_id}_api_key` unless `authentication.setting_name` overrides it; DB keys are not encrypted (masked in UI).
- Search For:
    - connectors_{$provider_type}_{$provider_id}_api_key
    - {PROVIDER_ID}_API_KEY
    - authentication.method: api_key
    - authentication.setting_name
- Recommended Action:
    - Prefer environment variables or PHP constants for secrets and document expected names.
    - If a custom DB setting name is required, set `authentication.setting_name` when registering the connector.
    - Ensure plugin file metadata is present so Connectors screen detects installation and activation status.
- Related Tickets:
    - https://core.trac.wordpress.org/ticket/64789
- Sources:
    - https://make.wordpress.org/core/2026/03/18/introducing-the-connectors-api-in-wordpress-7-0/

## Credential management moves to Connectors API / Settings → Connectors

- Type: behavior-change
- Severity: low
- Applies To: plugin | site
- Summary: API key management for AI providers is handled via the Connectors API and the Connectors admin UI; plugin authors should stop implementing their own credential storage UIs.
- Search For:
    - Connectors API
    - Settings → Connectors
- Recommended Action:
    - Remove or stop managing provider credential UI/flows in plugins and rely on the Connectors API and documented provider plugins for key management.
- Related Tickets:
    - (none)
- Sources:
    - https://make.wordpress.org/core/2026/03/24/introducing-the-ai-client-in-wordpress-7-0/

## Connector auto-discovery via WP AI Client

- Type: new-feature
- Severity: low
- Applies To: plugin
- Summary: Connectors are auto-created for AI providers discovered from `AiClient::defaultRegistry()`. Built-in connectors (Anthropic, Google, OpenAI) are registered by default and provider registry metadata merges on top of defaults.
- Search For:
    - AiClient::defaultRegistry
    - "auto-discover connectors"
- Recommended Action:
    - Register your provider with the WP AI Client default registry to allow auto-creation of connectors and avoid duplicate connector IDs.
    - Use registry methods and check `is_registered()` before unregistering.
- Related Tickets:
    - (none)
- Sources:
    - https://make.wordpress.org/core/2026/03/18/introducing-the-connectors-api-in-wordpress-7-0/

## Sites on PHP 7.2/7.3 remain on WordPress 6.9 branch after 7.0 release

- Type: behavior-change
- Severity: low
- Applies To: site
- Summary: Sites that cannot upgrade PHP will remain on the 6.9 branch after 7.0 ships; only one branch receives mainline security updates with backports to older branches "when possible".
- Search For:
    - "6.9 branch"
    - "security updates"
- Recommended Action:
    - Plan PHP upgrades for affected sites to continue receiving mainline fixes.
    - If immediate upgrade is impossible, schedule a migration or isolate legacy sites and apply manual backports as needed.
- Related Tickets:
    - (none)
- Sources:
    - https://make.wordpress.org/core/2026/01/09/dropping-support-for-php-7-2-and-7-3/
