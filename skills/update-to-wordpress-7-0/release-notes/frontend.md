# Frontend

## Viewport-based visibility hides blocks with CSS (blocks still render in DOM)

- Type: behavior-change
- Severity: medium
- Applies To: multiple
- Summary: Blocks hidden by the new viewport visibility rules (mobile/tablet/desktop) are rendered into the page HTML and hidden via CSS; they are not removed from the DOM. This differs from the previous `blockVisibility: false` behavior that prevented server-side rendering.
- Search For:
    - `blockVisibility: false`
    - has-custom-css (related)
- Recommended Action:
    - Audit code or integrations that relied on blocks being absent from rendered HTML (server-side checks, front-end scripts, structured data/SEO).
    - If a block must be completely removed from output, use `blockVisibility: false`.
    - Adjust front-end JS/CSS selectors to account for elements that may be present but visually hidden.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/issues/73776
    - https://github.com/WordPress/gutenberg/issues/72502
- Sources:
    - https://make.wordpress.org/core/2026/03/15/block-visibility-in-wordpress-7-0/

## Per-instance CSS stored and injected with generated instance class and global stylesheet

- Type: new-feature
- Severity: high
- Applies To: theme | plugin | site
- Summary: Per-instance Custom CSS is serialized into the block `style.css` attribute. A unique hashed class (`wp-custom-css-<hash>`) and `has-custom-css` are added to the block root; a site-level stylesheet (`id="wp-block-custom-css"`) is registered so instance rules are scoped and load after Global Styles. Server-rendered blocks must render a standard outermost element for injection to work.
- Search For:
    - `"style":{"css":`
    - has-custom-css
    - wp-custom-css- and id="wp-block-custom-css"
    - WP_HTML_Tag_Processor
- Recommended Action:
    - For server-rendered blocks ensure the block outputs a reliable outermost HTML element for the injector to attach the hashed class.
    - Audit code that reads/mutates `style` attributes to handle the new `css` key.
    - Test for selector collisions, caching, and stylesheet id conflicts; ensure correct specificity ordering.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/issues/56127
    - https://github.com/WordPress/gutenberg/pull/73959
- Sources:
    - https://make.wordpress.org/core/2026/03/15/custom-css-for-individual-block-instances-in-wordpress-7-0/

## Overlays render full-screen only in this release

- Type: behavior-change
- Severity: low
- Applies To: theme, site
- Summary: Initial implementation of navigation overlays renders them full-screen only. Dialog-based (non-full-screen) overlays and click-outside-to-close behavior are not supported in 7.0.
- Search For:
    - full-screen
    - <dialog>
    - clicking outside to close
- Recommended Action:
    - Do not design themes that rely on non-full-screen overlay behavior until dialog-based overlays are implemented; plan to update styles when support is added.
- Related Tickets:
    - https://github.com/WordPress/gutenberg/issues/61297
- Sources:
    - https://make.wordpress.org/core/2026/03/04/customisable-navigation-overlays-in-wordpress-7-0/
