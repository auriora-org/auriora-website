# Changelog

All notable changes to the AURIORA website are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Released versions are tagged in version control.

## 1.1.0 - 2026-07-10

### Added

- "What we are building" section presenting the open instrumentation work — the module families in development — with a link to the GitHub organization
- Background art for the new section (`building.webp`, `building-mob.webp`)

### Changed

- The footer GitHub link moved into the "What we are building" section's call to action

- Principles section rewritten around the working method (observation before interpretation, transparency, engineering care) to remove overlap with the Open Question section
- Direction section condensed: the duplicated "not a theory to defend" sentence replaced by a single open invitation
- "More-Than-Human" pillar renamed to "Beyond the Human"

## 1.0.0 - 2026-07-10

First tagged release. The site is live at [auriora.org](https://auriora.org/).

### Added

- Single-page static site built with plain HTML, CSS and vanilla JavaScript — no build step, no framework, no runtime dependencies
- Section bands (Vision, Question, Open Question, Principles, Fields, Direction) with animated canvas visuals over per-section WebP backgrounds in desktop and mobile variants
- Scroll-driven reveals, desktop section paging, manual scroll restoration and header state handling
- Custom 404 page with dedicated background art
- Search and agent support: `robots.txt` with content-usage preferences, `sitemap.xml`, `llms.txt`, JSON-LD structured data, favicons and a social share image
- MIT license
