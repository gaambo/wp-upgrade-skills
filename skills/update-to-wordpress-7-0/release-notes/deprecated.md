# Deprecated

## state.navigation (hasStarted / hasFinished) in core/router is deprecated

- Type: deprecation
- Severity: medium
- Applies To: multiple
- Summary: Accessing `state.navigation` on the `core/router` store (notably `hasStarted` and `hasFinished`) is deprecated in 7.0 and will emit console warnings in development (SCRIPT_DEBUG). Direct access will stop working in a future release.
- Search For:
    - store( 'core/router' )
    - state.navigation
    - hasStarted
    - hasFinished
- Recommended Action:
    - Remove or replace code that reads `state.navigation` (hasStarted/hasFinished). Plan to adopt the official navigation API when released (7.1).
    - Add guards to avoid relying on internal properties and remove dev-only workarounds.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/pull/70882
- Sources:
    - https://make.wordpress.org/core/2026/02/23/changes-to-the-interactivity-api-in-wordpress-7-0/
