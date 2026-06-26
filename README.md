# Auriora - Website

The website for **Auriora**, an open research initiative exploring intelligence,
adaptation and communication across living systems through observation,
measurement and open experimentation.

> Auriora is not a theory to defend, but a question to explore:
> *What is intelligence, and how does it emerge in different living systems?*

Live: **https://auriora.org/**

## Overview

A single-page static site built with plain HTML, CSS and vanilla JavaScript - no
build step, no framework, no dependencies. It presents the initiative as a
sequence of full-height "bands" (Vision, Question, Open Question, Principles,
Fields, Direction) over an animated signal background, with scroll-driven reveals
and desktop section paging.

## Structure

```
.
├── index.html        # Page markup - header, the section bands, footer, JSON-LD
├── styles.css        # All styling, including responsive + per-section backgrounds
├── script.js         # Scroll restoration, reveals, nav state, paging, canvas visuals
├── assets/           # Favicons, logo, and per-section WebP backgrounds (desktop + -mob)
├── robots.txt        # Crawler access + sitemap pointer
├── sitemap.xml       # Single-URL sitemap
└── llms.txt          # Structured site summary for LLM agents (llmstxt.org)
```

### Sections (anchors on the home page)

| Anchor             | Section              |
| ------------------ | -------------------- |
| `#home`            | Hero / intro         |
| `#vision`          | Vision               |
| `#question`        | The question         |
| `#open-question`   | An open question     |
| `#principles`      | Principles           |
| `#fields`          | Fields of exploration|
| `#direction`       | Direction            |

## How it works

- **Animated visuals** - each band has a `<canvas data-variant="…">` (wave, ring,
  network, field, web) rendered by `script.js`, layered over per-section WebP
  backgrounds.
- **Scroll reveals** - sections marked `.reveal` fade/slide in via an
  `IntersectionObserver`, with a load-time safety net so nothing stays hidden.
- **Manual scroll restoration** - the script manages `history.scrollRestoration`
  itself to avoid the reveal offset drifting the restored position on each reload;
  an incoming `#hash` deep link takes precedence.
- **Header state** - a blur/scrim fades in only while a band boundary crosses the
  header, and the active nav link is marked as you scroll.
- **Desktop paging** - at ≥921px, wheel/key input snaps between full-height bands.
- **Responsive assets** - every background ships a desktop and a `-mob` mobile
  variant tuned for portrait composition.

## Develop locally

No build is required - open `index.html` directly, or serve the folder so that
relative asset paths and the canvas visuals behave as in production:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

Publish the repository contents as static files at the site root. Ensure these
are reachable at the domain root:

- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`

The site uses Cloudflare Web Analytics (beacon loaded in `index.html`).

## Conventions

- Vanilla, dependency-free; keep it that way unless there's a strong reason.
- Add new background images in both desktop and `-mob` variants (see `assets/`).
- When content or sections change, update `sitemap.xml`'s `lastmod` and the
  section list in `llms.txt`.

## Contact

contact@auriora.org

© Auriora
