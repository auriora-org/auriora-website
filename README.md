# AURIORA Website

The official website of AURIORA, an open engineering and research initiative exploring intelligence, adaptation and communication across living systems.

Live: **[auriora.org](https://auriora.org/)**

## Purpose

This repository contains the source of the AURIORA landing page. It presents the initiative — vision, question, principles and fields of exploration — and is the public entry point to the AURIORA ecosystem on [GitHub](https://github.com/auriora-org).

The site is a single-page static site built with plain HTML, CSS and vanilla JavaScript: no build step, no framework, no runtime dependencies.

## Status

Released — the site is live at [auriora.org](https://auriora.org/) and deployed from this repository.

## Repository structure

```text
.
├── index.html        # Page markup — header, the section bands, footer, JSON-LD
├── 404.html          # Custom 404 page with dedicated background art
├── styles.css        # All styling, including responsive + per-section backgrounds
├── script.js         # Scroll restoration, reveals, nav state, paging, canvas visuals
├── assets/           # Favicons, logo, and per-section WebP backgrounds (desktop + -mob)
├── robots.txt        # Crawler access, content-usage preferences + sitemap pointer
├── sitemap.xml       # Single-URL sitemap
└── llms.txt          # Structured site summary for LLM agents (llmstxt.org)
```

## How it works

- **Section bands.** The page is a sequence of full-height bands (Vision, Question, Open Question, Principles, Fields, Direction), each an anchor on the home page.
- **Animated visuals.** Each band has a `<canvas data-variant="…">` (wave, ring, network, field, web) rendered by `script.js`, layered over per-section WebP backgrounds.
- **Scroll reveals.** Sections marked `.reveal` fade and slide in via an `IntersectionObserver`, with a load-time safety net so nothing stays hidden.
- **Manual scroll restoration.** The script manages `history.scrollRestoration` itself so the reveal offset does not drift the restored position on reload; an incoming `#hash` deep link takes precedence.
- **Header state.** A blur backdrop fades in only while a band boundary crosses the header, and the active navigation link is marked while scrolling.
- **Desktop paging.** At widths of 921 px and above, wheel and key input snap between full-height bands.
- **Responsive assets.** Every background ships a desktop and a `-mob` mobile variant tuned for portrait composition.

## Local development

No build is required. Serve the folder so relative asset paths and the canvas visuals behave as in production:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deployment

Publish the repository contents as static files at the site root. These files MUST be reachable at the domain root:

- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`

The site uses Cloudflare Web Analytics (beacon loaded in `index.html`).

## Conventions

- The site stays vanilla and dependency-free unless there is a strong reason to change that.
- New background images are added in both desktop and `-mob` variants (see `assets/`).
- When content or sections change, `sitemap.xml`'s `lastmod` and the section list in `llms.txt` are updated in the same change.
- Documentation in this repository follows the [AURIORA Documentation Standard](https://github.com/auriora-org/auriora-documentation-standard) (`ADS`).

## Versioning and changes

Notable changes are recorded in the [CHANGELOG](./CHANGELOG.md); released versions are tagged in version control.

## Contributing

Changes go through pull requests. Broken links, content defects and suggestions are reported via the repository issue tracker.

## License

The website source is licensed under the [MIT License](./LICENSE).

## Contact

[contact@auriora.org](mailto:contact@auriora.org)
