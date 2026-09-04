# APGI Design System

## Brand at a Glance

**"Consciousness isn't mystical. It's mathematical."**

- **Colors:** Precision Red `Π` `#FF3366` · Error Yellow `|ε|` `#FFCC00` · Workspace Purple `GW` `#9966FF` · Neuromod Green `#00CC99` · Threshold Slate `Bₜ` `#3B4F6B`
- **Type:** Crimson Pro (headlines) / Inter (body & UI) / Fira Code (code & data)
- **APGI is:** clinical · precise · parameter-first · quietly confident in uncertainty
- **APGI is not:** playful · gradient-heavy · vague · decorative with its data

See the "Brand at a Glance" page in the print document for a wall-postable one-pager version of this summary.

## Who this is for

Frontend engineers, UI designers, and data scientists building **APGI Neuroscape**, **APGI Architect**, API docs, and Simulation Environment notebooks. Designers use this doc to make new-screen decisions consistently; engineers use the token files and components directly; data scientists building notebook visualizations use the data-viz color scales and gauge spec. If your situation isn't covered by a rule below, fall back to the Core Principles.

## Core Principles

1. **Parameter-first.** Every visual choice should trace back to one of the five measured quantities or to plain neutral UI chrome — never to "what looks nice." If you can't name which parameter a color/shape encodes, don't use it.
2. **Clinical restraint.** When in doubt, remove the decoration. No shadows, no gradients, no bounce easing, no emoji — the instrument should look like it's reporting data, not selling a feeling.
3. **High data density, low visual noise.** This is a tool for people who will stare at it for hours. Favor hairlines and whitespace over borders-with-fills; favor compact spacing in tables over generous card padding.
4. **Legibility beats fidelity to a single hex code.** A semantic color that fails contrast on a given surface is a bug, not brand law — use its text-safe or dark-mode variant; never ship an inaccessible parameter color as text.

## What is APGI

APGI is a computational-neuroscience research framework. Its products model consciousness and cognition through a small set of quantified parameters — interoceptive precision, prediction-error magnitude, global-workspace broadcast, neuromodulator tone, and thalamic gating threshold. Every visual choice in this system exists to make those parameters legible: **color is instrumentation, not decoration.**

**Brand personality:** Clinical. Precise. Objective. Inquisitive.

| Voice attribute | Not |
|---|---|
| Authoritative | Cold or robotic |
| Precise | Jargon for its own sake |
| Technical yet clear | Dumbed down |
| Confident in uncertainty ("Π = 0.42 ± 0.03") | False certainty |

### Sources this system was built from

This system was built from a **brand-guidelines brief** provided directly in chat (color table with semantic parameter mappings, typography spec, spacing/grid rules, logo-usage rules) plus a design-critique pass that surfaced accessibility, data-viz, and documentation gaps — both are transcribed/resolved below. No Figma file, GitHub repo, or existing UI codebase was attached. As a result:

- Colors, type, spacing, and logo rules are transcribed from that brief; anywhere the brief was silent or created an accessibility failure, this system adds an explicit rule and flags it as an addition (contrast-safe text variants, dark-mode luminance shifts, full neutral/data-viz scales, breakpoints, z-index, focus states, interaction-state values, glossary, icon spec, logo variations).
- No component library or screen inventory was provided, so the component set (Components section) is an original, from-scratch build sized to what a research/product team like APGI typically needs — see "Intentional additions."
- A real logo file was provided (`assets/logo.jpg`) and is used throughout — see Logo System below.
- No product screenshots, decks, or copy samples were provided, so Content Fundamentals is inferred from the brief's own register rather than quoted from real product copy. Flag anything that doesn't match your actual voice.

If a Figma file, codebase, or slide deck exists for APGI, attach it and this system should be rebuilt against it as ground truth.

---

## Color System

Colors encode specific parameters. **Reusing a semantic color for something it doesn't measure damages scientific credibility** — this is the single most important rule in this system.

| Name | Parameter | Fill hex | Meaning |
|---|---|---|---|
| Precision Red | Π | `#FF3366` | Interoceptive precision weighting — insula/ACC confidence, urgency |
| Error Yellow | \|ε\| | `#FFCC00` | Prediction error magnitude — surprise, mismatch |
| Workspace Purple | Global Workspace | `#9966FF` | Frontoparietal broadcast — the ignition event itself |
| Neuromod Green | Neuromodulator | `#00CC99` | Brainstem arousal tone — baseline chemical environment |
| Threshold Slate | Bₜ | `#3B4F6B` | Thalamic gate — darkens as threshold (suppression) rises |

Never use: Precision Red for danger/alerts, Error Yellow for warnings, Threshold Slate as decorative dark, Workspace Purple decoratively, Neuromod Green as a success state. `#00B4FF` (blue) is retired — do not reintroduce, including in the logo mark.

### Accessibility — this was the brief's biggest gap, now fixed

Four of the five fill colors **fail WCAG AA as text on white** (Precision Red 3.1:1, Error Yellow 1.6:1, Workspace Purple 3.3:1, Neuromod Green 2.0:1 — AA needs 4.5:1). The brief's "semantic colors stay identical in both modes" rule is also a trap: Threshold Slate is 8.1:1 on white but only ~1.5:1 on the `#0F172A` dark background — it nearly disappears.

Fix: fill hexes stay exactly as specified above for **charts, gauge fill, icon glyphs, badge backgrounds** — never for text. For **text, outline icons, and links**, use `--color-*-text` (a darkened same-hue variant, 4.5:1+ on white/light-surface). In dark mode those same variables auto-swap to lightened `--color-*-dark` variants via `[data-mode="dark"]`, so the meaning never changes, only the luminance. See `tokens/colors.css` and the "Contrast — Text-Safe Variants" guideline card for exact hexes and ratios. `--text-on-*` tokens give the correct foreground when a parameter color is used as a background fill (e.g. a badge).

### Full neutral scale

Three brand surfaces (`--color-white`, `--color-light-surface`, `--color-near-black`) are joined by a full 10-step neutral scale (`--neutral-50`…`--neutral-900`) for secondary text, borders, disabled states, and chart axes/gridlines — see `tokens/colors.css`.

### Data visualization scales

Scientific plots need more than 5 categorical swatches:
- **Sequential** (`--viz-seq-1..5`) — single-hue ramp off the Error Yellow family, for magnitude-only heatmaps (e.g. |ε| mismatch).
- **Diverging** (`--viz-div-neg-3..pos-3`) — Threshold Slate → neutral → Precision Red, for signed values (e.g. prediction-error direction relative to baseline).
- **Categorical** (`--viz-cat-1..5`) — the 5 semantic colors in fixed order, for a legend distinguishing the parameters themselves. Never reassign a slot to an unrelated series.

**Light mode** (default): white background, near-black text. Marketing pages, book interior, print collateral, brand documents, academic papers.
**Dark mode** (app-specific only): `#0F172A` background, `#E2E8F0` text. APGI Neuroscape, APGI Architect, API docs, Simulation Environment notebooks.

### Monochrome / academic print

Figures submitted to academic venues are frequently printed or photocopied in black-and-white, so **parameter identity must never rely on color alone** in a chart destined for print — this follows directly from Core Principle 3 (high data density, low visual noise: a chart that becomes noise in grayscale has failed).

Converting each fill hex to grayscale luma (ITU-R 601: `0.299R + 0.587G + 0.114B`) surfaces a real collision: Precision Red (118) and Neuromod Green (137) are often assumed to clash, but at 19 points apart they remain distinguishable. The actual collision is **Workspace Purple (135) and Neuromod Green (137)** — only 2 points apart, functionally identical in grayscale.

Rule: every parameter gets a fixed `stroke-dasharray` in addition to its color, so identity survives color loss:

| Parameter | Grayscale luma | Stroke pattern |
|---|---|---|
| Π Precision Red | 118 | solid |
| \|ε\| Error Yellow | 196 | dense dotted |
| GW Workspace Purple | 135 ⚠ | dash-dot |
| Neuromod Green | 137 ⚠ | short dashed |
| Bₜ Threshold Slate | 76 | long dashed |

Test every figure destined for print by converting it to grayscale before submission — see the "Monochrome / Grayscale Compatibility" guideline card for exact dash-array values.

## Typography

| Role | Font | Weights | Sizes |
|---|---|---|---|
| Headlines & Titles | Crimson Pro (serif) | 400·600·700 | Display 44→72px (fluid) · H1 32→48px (fluid) · H2 22→30px (fluid) |
| Body, Labels, Captions | Inter (sans) | 400·500·700 | H3 20 · Body 16 · Caption 14 · Micro 12 (fixed) |
| Equations & Symbols | Computer Modern / KaTeX | — | Inline = 1em (inherits paragraph size); display blocks = 1.2 line-height. Never substitute Arial/Inter. |
| Code / CLI / API | Fira Code (mono) | — | Inline = 0.9em + −0.05em baseline shift so it sits on the text baseline; blocks = 1em |

Body line-height: **1.5** (tightened from the brief's 1.625 — improves scanning of dense, parameter-heavy paragraphs). Display/H1/H2 use `clamp()` fluid sizing so 72px doesn't break mobile layouts; H3/Body/Caption/Micro stay fixed Inter sizes. Each level carries its own letter-spacing/line-height token (Crimson Pro needs tighter tracking + looser leading at large sizes than Inter does) — see `tokens/typography.css` and the "Full Type Scale" guideline card.

Fallback stacks (CDN-failure safe): Crimson Pro → Iowan Old Style → Georgia → Times New Roman → serif. Inter → system-ui stack → sans-serif. Fira Code → SF Mono → Consolas → Liberation Mono → monospace.

Google Fonts import: `Crimson Pro: ital,wght@0,400;0,600;0,700;1,400` + `Inter: wght@400;500;700` (Fira Code added for code). Equation rendering needs KaTeX (web) / Computer Modern (print) — neither is wired up yet; flag if you need it.

## Layout & Spacing

Base unit 8px; all spacing is a multiple of 8 (8,16,24,32,48,64,96). A **compact density mode** (`[data-density="compact"]`, 4px base unit) is available for data tables and dense readouts — see `tokens/spacing.css`.

**Breakpoints:** Mobile `<768px` (4-col) · Tablet `768–1024px` (8-col) · Desktop `>1024px` (12-col).
Desktop grid: 12-col, **1440px** max-width (widened from the brief's 1200px — too narrow for dense scientific data tables), 24px gutters, 48px outer margins. Mobile: 4-col, 100% width, 16px gutters/margins.

Card: 24px padding (12px in compact mode), 1px border (`rgba(0,0,0,.08)` light / `rgba(255,255,255,.06)` dark), 12px radius on desktop — **8px on mobile** (12px reads oversized on small components).
Gauge: 4px track / 8px fill, track `#E2E8F0` (light) / `#2C3E50` (dark), fill = parameter semantic color, label Inter 12px. Null/empty data uses an explicit `--gauge-track-empty` neutral, never a blank track.
Section rhythm: 96px between major sections, 48px between components, 24px between elements within a component.

**Z-index scale** (required since shadows are banned — stacking must be explicit): Base 0 · Dropdown 10 · Sticky 20 · Overlay 30 · Modal 50 · Popover 60 · Toast 70 · Tooltip 100.

## Logo System

Logo asset: `assets/logo.png` (transparent background — use on any surface; `assets/logo.jpg` is the original flat-background file, kept for reference). The mark renders "APGI" with a dendritic/neuron-branch motif growing out of the "A" and "G" — a visual nod to neural signaling, in Precision Red and a blue accent (used only in the mark itself, not as a UI color — UI blue `#00B4FF` remains retired; if the mark is ever redrawn, replace that blue with Near Black or Threshold Slate for full brand cohesion).

Rules from the brief:
- Primary lockup: mark left of/above "APGI Framework" wordmark, Inter Bold.
- Symbol mark: below 120px wide, or where the wordmark is contextually redundant (app icons, favicons).
- Monochrome: black-on-light / white-on-dark only when color reproduction is impossible.
- Minimum size: lockup 200px screen / 50mm print; symbol 32px.
- Clearspace: equal to the cap-height of the wordmark's "A" on all sides.
- Forbidden: rotating, off-system recoloring, stretching, drop shadows, placement on mid-tone backgrounds without a solid panel.

**Approved backgrounds** (no panel needed): White, Light Surface (`#F8FAFC`), Near Black (`#0F172A`). Any other color needs a solid panel in one of those three underneath the mark.
**Co-branding:** equal optical (not pixel) height with the partner/university/conference mark, 24px minimum clearspace on each side of a 1px hairline divider, APGI mark never sized smaller than the partner mark.
**Export formats:** SVG for web/product UI, PNG-transparent for fallback/slides/docs, PDF/EPS for print and partner submissions.

Use `assets/logo.png` (transparent) wherever the primary lockup belongs — it works on both light and dark surfaces.

## Iconography

No icon set, sprite, or icon font was provided in the brief. **[Lucide](https://lucide.dev)** icons are used as a CDN substitute — stroke-based, geometric, MIT-licensed, no local files to manage. If APGI has its own icon set, attach it and this substitution should be replaced.

- **Stroke weight:** 2px at default 20–24px size; **1.5px at 14–16px** (dense tables, chips) — 2px looks too heavy that small.
- **Color:** icons inherit the semantic parameter color they represent (a "pulse" icon renders in Neuromod Green, not default black); non-semantic UI chrome icons use `--neutral-600`.
- **Text alignment:** `vertical-align: middle` plus a −1px optical nudge when set inline with Inter text.
- No emoji or unicode-glyph icons anywhere, consistent with the clinical tone.

## Content Fundamentals

Inferred from the register of the brand brief itself — no product copy samples were supplied, so treat this as a starting hypothesis, not a transcribed voice guide.

- **Register:** precise, clinical, parameter-first. Sentences name the mechanism ("interoceptive precision weighting"), not a vibe. Avoid marketing-soft language ("smart", "delightful"); prefer measurable, falsifiable language.
- **Person:** unclear from brief — default to second-person ("you") for product UI copy, third-person/passive for scientific documentation, until real copy is attached.
- **Casing:** sentence case for UI labels and headings; parameter symbols keep their scientific notation (Π, |ε|, Bₜ) rather than being spelled out in UI chrome.
- **Numbers & units:** always show the unit or symbol next to a value (e.g. "Bₜ 0.62", not "0.62").
- **Emoji:** none. The brief's tone (insula/ACC, frontoparietal, thalamic gate) is clinical/academic — emoji would undercut credibility.
- **Vibe:** a research instrument, not a consumer app — closer to a lab notebook or an EEG monitor's readout than a SaaS dashboard.
- **Glossary — say this, not that:** see the "Content Glossary" guideline card, e.g. instead of "Error! Connection timed out" write "ε: API connection latency exceeded 500ms."

## Visual Foundations

- **Color:** five parameter colors are instrumentation — each maps 1:1 to a measured quantity. Fill hexes are identical in light/dark mode; text/icon rendering uses the contrast-safe `--color-*-text` variants (see Color System > Accessibility). Everything else (surfaces, text, borders) is neutral grayscale so the parameter colors always read as signal, not decoration.
- **Type:** serif (Crimson Pro) for headlines/titles only; sans (Inter) for everything functional; mono (Fira Code) for anything literal. Equations render in KaTeX/Computer Modern, never Arial/Inter.
- **Backgrounds:** flat and neutral — white (light) or near-black `#0F172A` (dark). No gradients, no photography-driven hero treatments, no textures. Any imagery should be scientific/diagrammatic (plots, gauges, signal traces).
- **Animation:** restrained — 150–200ms, linear-ish or ease-out transitions on state changes (gauge fill, threshold shift), no bounce/spring easing. Respect `prefers-reduced-motion` — all decorative motion should disable cleanly.
- **Hover/press states — quantified, not vague:** hover = 4% black overlay (light mode) / 4% white overlay (dark mode); active/press = 8% black / 8% white; disabled = 40% opacity. Semantic parameter colors never shift hue on hover/press (that would imply the underlying parameter changed).
- **Focus states (accessibility):** every interactive element gets a 2px solid Workspace Purple outline with a 2px offset on keyboard focus (`:focus-visible`) — this is the one place a semantic color intentionally appears as UI chrome, since shadows/glows are banned as the alternative.
- **Borders:** hairline only — 1px, `rgba(0,0,0,.08)` light / `rgba(255,255,255,.06)` dark.
- **Shadows:** none. Borders separate cards; a raised surface (dropdown, popover) uses a hairline border + a **solid**, non-translucent fill one step lighter/darker than its parent surface — never a shadow to imply elevation.
- **Corners:** 12px on cards (8px on mobile); smaller controls (pills, tags) use `--radius-pill` or `--radius-sm` (6px).
- **Loading/skeleton states:** neutral shimmer only (`--neutral-200` light / raised dark surface) — a loading placeholder is not a measured value, so it never borrows a parameter color.
- **Transparency/blur:** none — surfaces stay opaque so instrument readings stay legible.

## Versioning & Governance

- **Semver-style versioning:** breaking token/component changes bump a major version; new tokens/components/cards bump minor; copy/spec clarifications bump patch. Track changes in this readme's history (or a `CHANGELOG.md` once this system ships to more than one consuming project).
- **Requesting a new component or reporting an issue:** open with the specific screen/use-case that isn't covered, the parameter(s) involved (if any), and whether it's a gap in the brief or a proposed original addition — flag the latter clearly, as this doc does for "Intentional additions" below.
- **Source of truth:** this project (`tokens/`, `components/`, `styles.css`). The print document and `SKILL.md` are generated views of it — edit tokens/components here, not in the print doc.

## Intentional additions

No component source was provided, so a standard component set was authored from scratch, sized to a research/product team's needs: Button, Input, Select, Checkbox, Radio, Switch, Card, Badge, Tag, Tabs, Dialog, Toast, Tooltip, and a bespoke **Gauge** (the brief explicitly specifies gauge anatomy — track/fill/label — so this one is spec-derived, not invented).

## Index

- `styles.css` — root stylesheet, import this one file.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`, `interaction.css` (focus ring, hover/press/disabled overlays, reduced-motion, skeleton loaders).
- `components/core/` — Button, Input, Select, Checkbox, Radio, Switch, Card, Badge, Tag, Tabs, Dialog, Toast, Tooltip, Gauge (+ specimen cards).
- `ui_kits/neuroscape/` — sample dark-mode app screen (APGI Neuroscape) built from the components above.
- `guidelines/` — foundation specimen cards: colors (semantic, neutrals, contrast, data-viz), type (display/body/mono/full-scale/math-code), spacing (scale, card, breakpoints, interaction states), brand (wordmark, gauge, logo variations, content glossary), icon spec.
- `assets/` — `logo.png` (primary lockup, transparent), `logo.jpg` (original). No icon/illustration files provided (see Iconography above).
- `SKILL.md` — portable skill file for using this system elsewhere.
