# Deprecated

## state.navigation properties in core/router are deprecated

- Type: deprecation
- Severity: medium
- Applies To: multiple
- Summary: Accessing `state.navigation` (notably `state.navigation.hasStarted` and `state.navigation.hasFinished`) from the `core/router` store is deprecated in 7.0 and will emit development console warnings. Direct access may be removed in a future release.
- Search For:
    - `store( 'core/router' ).state.navigation`
    - `state.navigation.hasStarted`
    - `state.navigation.hasFinished`
- Recommended Action:
    - Stop reading `state.navigation` and remove code that relies on `hasStarted`/`hasFinished`. Replace with supported public navigation APIs when available, or use feature-detection/shims and test dev builds (`SCRIPT_DEBUG=1`) to locate warnings.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/pull/70882
- Sources:
    - https://make.wordpress.org/core/2026/02/23/changes-to-the-interactivity-api-in-wordpress-7-0/
