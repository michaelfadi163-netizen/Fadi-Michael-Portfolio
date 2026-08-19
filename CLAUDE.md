# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, hand-coded personal portfolio site ("FACETS" — see the palette comment at the top of `styles.css`) for Fadi Michael. Plain HTML/CSS/JS — no framework, no bundler, no package manager, no build step.

## Running / previewing

There is no dev server or build command. Open the HTML files directly in a browser, or use the VS Code launch config (`.vscode/launch.json`, "Open portfolio in Chrome") which launches `index.html` in Chrome via the Debugger extension. Any static file server works too (e.g. `python3 -m http.server`) since all asset paths are relative.

There is no linter, formatter, or test suite configured in this repo.

## Structure

- `index.html` — the single-page home (hero, work grid, about, skills, contact). Sections are anchor-linked (`#work`, `#about`, `#skills`, `#contact`).
- `project-one.html`, `project-two.html`, `project-three.html`, `project-four` — individual case-study pages, one per work-grid item. Each follows the same template: header/nav → `.project-hero` (title, intro, meta list) → `.deck-section` (image deck) → `.project-story` → optional `.project-video` (commented out by default) → `.project-next` (link to the next case study).
- `styles.css` — single global stylesheet for every page, organized in banner-commented sections (HEADER, HERO, MARQUEE, SECTIONS, WORK GRID, ABOUT, SKILLS, CONTACT, FOOTER, SCROLL REVEAL, RESPONSIVE, REDUCED MOTION). Design tokens (colors, fonts, spacing) are CSS custom properties in `:root`.
- `script.js` — shared behavior for all pages: mobile nav toggle, scroll-reveal via `IntersectionObserver`, the project-page image deck + full-screen lightbox slideshow, and the footer copyright year. The deck/lightbox code only runs if a `.deck` element exists on the page, so it's a no-op on `index.html`.
- `images/` — `project-one/` and `project-two/` hold each case study's numbered deck images (`01.png`, `02.jpg`, ...); `fadi.jpg` is the about-section portrait.
- `cv/fadi-michael-cv.pdf` — linked from the contact section.

## Conventions when adding/editing a project page

- Copy an existing project page (e.g. `project-one.html`) as the template rather than writing one from scratch — the header nav, `.deck-section` markup, and footer must stay byte-for-byte consistent across pages.
- Each page's `<nav class="site-nav">` hardcodes links to every project page plus `index.html#about/#skills/#contact`; when adding a new project page, update this nav block in *every* HTML file (there is no shared partial/include).
- Image deck: add or remove `<img class="deck-card">` elements freely inside `.deck` — `script.js` reads the DOM at load time and adapts (see the comment in `project-one.html` above `.deck-section`).
- The `.deck-count` span's initial text (e.g. `1 / 4`) is cosmetic only; `script.js` overwrites it via `layout()` once the page loads, so it doesn't need to match the actual card count.
- Update the `.project-next` link at the bottom to point to the following case study in sequence.
- Home page work-grid cards (`index.html`) link either to a local `project-*.html` case study or straight out to an external site (`target="_blank" rel="noopener"`) for work hosted elsewhere.

## Known inconsistencies (be aware, don't silently "fix" without asking)

- `project-four` is missing its `.html` extension on disk, but every page's nav links to `project-four.html`, and `index.html`'s work grid links to an external placeholder (`https://your-project-four.com`) instead of the local page. `images/project-four/` also doesn't exist yet, though `project-four` references images at that path.
- `index.html`'s 4th and 5th work-grid cards ("EMU Soccer Club", "RHYTHM & VINYL") point to placeholder external URLs (`your-project-four.com`, `your-project-five.com`) and reference images (`images/project-four.jpg`, `images/project-five.jpg`) that don't exist in `images/`.
