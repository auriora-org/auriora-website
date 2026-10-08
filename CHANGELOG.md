# Changelog

All notable changes to the AURIORA website are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Released versions are tagged in version control.

## Unreleased

### Changed

- Copy reviewed for scientific precision and for the actual state of the work. Vision separates systems with no nervous system (a root, a fungal network) from collective systems with no central control (an ant colony, whose individuals do have brains), states that sensing and responding are not the same as intelligence, only a measurable place to start, and describes the instruments as being built and developed in public rather than already published; The Question's seedling example no longer implies that a root senses a stone before touching it; Open Question no longer claims that humans are the only closely studied example of intelligence, but that concepts built around human and animal nervous systems travel badly to plants and fungi, and no longer calls the field "short on measurements" or asserts that recordings are often not shared: it acknowledges more than a century of experimental work on plant signaling and locates the difficulty in comparability and documentation; Direction asks how other living systems sense, respond and adapt instead of whether "the same signals" turn up elsewhere, and notes that a familiar-looking signal is only a clue until its function is understood; Principles turns "everything stays open" into a commitment ("everything we make is meant to stay open") and names methods alongside designs, data and reasoning
- Plants, fungi and the networks between them are described accurately: the hero lede, meta/Open Graph/Twitter/JSON-LD descriptions and README say "the networks they live in" instead of "the networks they form"; Focus starts with plants, where signals can be recorded with instruments Auriora can build and share, and names the fungi and networks around them as a later step instead of a current measurement capability; the "most directly observable" comparison is dropped
- Research directions are no longer presented as existing capabilities: the Chemical signaling pillar is marked as a later direction, not something measured yet, and the "Beyond the Human" pillar no longer claims that fungal network signals can be measured today
- "What we are building" no longer calls reproducibility "the field's hardest problem" (an unsupported ranking); it says the question needs instruments and results that someone else can repeat, describes the work as an open, modular platform in which measurement, stimulation and recording form one documented experiment, without naming internal components, and presents the first modules as a starting point rather than the platform's scope, which is meant to grow with new research questions
- `llms.txt` re-synchronized with the page copy; `sitemap.xml` `lastmod` updated

### Fixed

- "What we are building" band overran the fold on 768-900px-tall desktops, so desktop paging needed two gestures to move on. Its copy is tightened from 17 to 13 body lines without dropping a point, and on short wide viewports its padding, line height and the gaps around the closing question and link are trimmed so the block, GitHub link included, fits one screen
- Hero band overran the fold on short desktop viewports (1366×768, 1280×720, zoomed 1080p), so the "Scroll to explore" cue sat below the fold and desktop paging needed two gestures to reach Vision. The hero title size now also scales with viewport height (`min(6.4vw, 9.6vh)`, tighter below 660px tall) and the wide-layout hero padding is trimmed; the title is unchanged on normal-height desktops and on mobile

## 1.2.0 - 2026-10-04

### Changed

- Framing widened from "living systems" to "very different systems" in the hero headline, lede, meta/Open Graph/Twitter/JSON-LD descriptions, footer and README, so the headline question no longer presupposes what counts as alive or intelligent; the lede and descriptions now state the current focus explicitly (instruments for sensing, adaptation and communication, beginning with plants and the networks they form). "Living" is kept where the copy describes the actual biological focus (Focus pillars, Building section)
- `llms.txt` re-synchronized with the page copy; it had drifted to older Vision, Question, Open question, Principles and Direction wording
- "What we are building" wording aligned with the current architecture: the instruments are described as running with coordinated timing across modules rather than on a shared, synchronized time base; the audio module family is described as programmable sound for stimulation instead of parametric sound, and evoked responses as light- or sound-evoked
- Building section copy proofread: the module list is now a verb phrase instead of a colon list, the closing invitation names the instruments explicitly instead of a dangling "it" and reads "being built for you to use, question and improve", and "re-described" became "merely described"; Focus section "as stimulus" corrected to "as stimuli"
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
