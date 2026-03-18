# Tooling

## Beta support for PHP 8.5
- Type: behavior-change
- Severity: low
- Applies To: multiple
- Summary: 6.9 adds fixes for PHP 8.5 deprecations/warnings and labels PHP 8.5 (and 8.4) as "beta support" until adoption thresholds are met.
- Search For:
  - `PHP 8.5`
  - `beta support`
- Recommended Action:
  - Run CI/test suites on PHP 8.5, enable `WP_DEBUG` and address deprecation warnings before declaring full compatibility; avoid requiring PHP 8.5‑only features for production until GA support is declared.
- Sources:
  - https://make.wordpress.org/core/2025/11/21/php-8-5-support-in-wordpress-6-9/

## New TypeScript helper types for Interactivity API: `AsyncAction` and `TypeYield`
- Type: tooling
- Severity: low
- Applies To: multiple
- Summary: Adds `AsyncAction<ReturnType>` and `TypeYield<T>` to improve typing for async/generator Interactivity API actions and avoid circular typing issues.
- Search For:
  - `AsyncAction<`
  - `TypeYield<`
- Recommended Action:
  - Adopt these helper types in TypeScript code implementing Interactivity API async/generator actions and run builds to resolve typing errors.
- Sources:
  - https://make.wordpress.org/core/2025/11/12/changes-to-the-interactivity-api-in-wordpress-6-9/

## New PHPUnit assertion `assertEqualHTML()` for semantic HTML comparisons
- Type: tooling
- Severity: low
- Applies To: multiple
- Summary: `assertEqualHTML()` allows semantic comparisons of HTML strings (ignoring attribute order, quoting, insignificant whitespace), reducing brittle test failures.
- Search For:
  - `assertEqualHTML(`
- Recommended Action:
  - Replace fragile HTML string equality assertions in unit tests with `assertEqualHTML()` and update expectations where appropriate.
- Sources:
  - https://make.wordpress.org/core/2025/11/21/updates-to-the-html-api-in-6-9/

## Bundled external libraries updated (PHPMailer, SimplePie, sodium_compat, ID3)
- Type: tooling
- Severity: medium
- Applies To: multiple
- Summary: Core updates bundled libraries (PHPMailer → 6.11.1, SimplePie → 1.9.0, sodium_compat → 1.23.0, ID3 pending release); behavior/bugs may differ from older versions.
- Search For:
  - `PHPMailer 6.11.1`
  - `SimplePie 1.9.0`
  - `sodium_compat 1.23.0`
  - `getid3`
- Recommended Action:
  - Test email, feed parsing, and crypto-related functionality after upgrade; avoid bundling conflicting versions or vendor with unique namespaces.
- Sources:
  - https://make.wordpress.org/core/2025/11/17/miscellaneous-developer-focused-changes-in-6-9/
