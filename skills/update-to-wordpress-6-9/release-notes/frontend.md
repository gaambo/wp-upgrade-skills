# Frontend

## Hidden blocks are omitted from published markup and their assets
- Type: behavior-change
- Severity: medium
- Applies To: multiple
- Summary: A built-in Hide capability removes selected blocks from editor output and omits their markup; scripts and styles for hidden or empty-output blocks are dequeued by default.
- Search For:
  - `hidden blocks`
  - `enqueue_empty_block_content_assets`
  - `Hidden` icon (List View)
- Recommended Action:
  - Audit pages that rely on block markup or block-enqueued scripts/styles; treat hidden blocks as absent from the DOM and test pages with blocks hidden.
  - If a block must always produce markup or assets, move critical output/asset registration to server-side code (`render_callback`) or use `enqueue_empty_block_content_assets` filter to re-enable assets selectively.
  - Test List View and keyboard toggles (`Ctrl+Shift+H`, `⌘+Shift+H`) for editor workflows.
- Sources:
  - https://make.wordpress.org/core/2025/12/01/ability-to-hide-blocks/
  - https://make.wordpress.org/core/2025/11/18/wordpress-6-9-frontend-performance-field-guide/

## CSS-generated content now hidden from assistive technologies
- Type: behavior-change
- Severity: medium
- Applies To: theme | plugin | site
- Summary: Core hides CSS-generated content (::before/::after) from assistive tech; themes/plugins that relied on generated text being announced may lose that exposure.
- Search For:
  - `::before`
  - `::after`
  - `content:`
  - `ticket 40428`
- Recommended Action:
  - Move meaningful text into real DOM or use ARIA attributes; test with screen readers and update selectors/JS that expected generated content.
- Sources:
  - https://make.wordpress.org/core/2025/11/19/accessibility-improvements-in-wordpress-6-9/

## Heading block background padding scoped to `.wp-block-heading`
- Type: behavior-change
- Severity: medium
- Applies To: theme
- Summary: Background padding selector now targets `.wp-block-heading.has-background` so headings that only have `has-background` without the block class will not receive default padding.
- Search For:
  - `has-background` on heading elements
  - `wp-block-heading`
- Recommended Action:
  - Update theme styles to explicitly target heading selectors that need padding (e.g., `h1.page-title.has-background`) or include `.wp-block-heading` where appropriate; test pages with titles and archives.
- Sources:
  - https://make.wordpress.org/core/2025/11/12/heading-block-css-specificity-fix-in-wordpress-6-9/

## Router regions and `attachTo` option for client navigation
- Type: behavior-change / new-feature
- Severity: medium
- Applies To: plugin | theme
- Summary: Router regions inside interactive elements will update during client navigation and now accept an `attachTo` option to render regions outside the initial DOM (e.g., overlays into `body`).
- Search For:
  - `data-wp-router-region`
  - `data-wp-interactive`
  - `attachTo`
- Recommended Action:
  - Ensure router regions are declared inside `data-wp-interactive` contexts, use `attachTo` when rendering regions outside initial containers, and test mount/unmount behavior across navigations.
- Sources:
  - https://make.wordpress.org/core/2025/11/12/interactivity-apis-client-navigation-improvements-in-wordpress-6-9/

## Classic themes now load block styles on demand by default
- Type: behavior-change
- Severity: high
- Applies To: theme, site, plugin
- Summary: Classic themes opt into loading separate core block styles on demand (reduces CSS in head but may change timing and order when `global-styles` and block CSS appear).
- Search For:
  - `should_load_separate_core_block_assets`
  - `wp_load_classic_theme_block_styles_on_demand`
  - `wp_enqueue_global_styles`
- Recommended Action:
  - Allow separate block assets to load on demand or set `add_filter( 'should_load_separate_core_block_assets', '__return_false' );` early if TTFB regressions are unacceptable; explicitly enqueue block styles when rendering content outside `do_blocks()`.
- Sources:
  - https://make.wordpress.org/core/2025/11/18/wordpress-6-9-frontend-performance-field-guide/
