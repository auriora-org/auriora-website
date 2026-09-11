# Changelog

All notable changes to the AURIORA website are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Released versions are tagged in version control.

## Unreleased

### Changed

- "What we are building" wording aligned with the current architecture: the instruments are described as running with coordinated timing across modules rather than on a shared, synchronized time base; the audio module family is described as programmable sound for stimulation instead of parametric sound, and evoked responses as light- or sound-evoked
- Building section copy proofread: the module list is now a verb phrase instead of a colon list, the closing invitation names the instruments explicitly instead of a dangling "it", and "re-described" became "merely described"; Focus section "as stimulus" corrected to "as stimuli"
- Focus section states that Auriora does not start from a presupposed plant intelligence to be proven, but from what the systems measurably do
- Building section spells out what reproducibility means (open designs, versioned interfaces, documented calibration, recorded timing), notes that the standards and guides are already public while instrument repositories follow at releasable state, and ends with a direct contact call to action
- Inline links inside body copy are underlined (`.band p a`)
- Building band layout: the title stays on one line on wide screens and the vertical rhythm is slightly tighter, so the closing link stays clear of the fold on common desktop heights
- Fields section reframed as "Focus": the page now starts from plants and living networks and their measurable signal channels (electrical, chemical, light, sound and vibration) instead of the four broad areas of exploration; the `#fields` anchor became `#focus`
- Direction wording generalized; em-dashes removed from body copy
- Favicon redrawn with a full-bleed ring and a theme-aware SVG icon for better contrast

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
