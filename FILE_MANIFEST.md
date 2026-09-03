# APGI File Manifest — apgiframework.com

- **stays** — ships on the live public site, either as-is today or once the specific fix noted is applied. (Where a fix is required, it's named — see [CLAIM_AUDIT.md](CLAIM_AUDIT.md) and [TASKS.md](TASKS.md) for the work itself.)
- **archived** — removed from the deployed/public surface. Recommended for deletion or relocation out of the deployed tree; not a live roadmap item.
- **internal** — kept in the repo, not public-facing. Dev tooling, admin surfaces, or content that is blocked from public release by a claim-discipline finding until that finding is fixed (at which point it moves to *stays* — noted per file).
- **future** — a real but undecided item: either a product/roadmap question this audit can't resolve, or scaffolding for a feature that isn't wired up yet and needs an owner decision before it's built out or removed.

## Root-level pages

| file | verdict | note |
|---|---|---|
| index.html | stays | **updated this session** — replaced with a "coming soon" placeholder (Neural Glow styling, no fabricated claims) pending the rest of Phase 0/1 remediation; original rich content preserved at `home-full.html` below |
| home-full.html | internal | **new this session** — full backup of the original index.html content, preserved rather than deleted; not linked from anywhere, restore from here once the site is ready to leave "coming soon" |
| index-apgi.html | archived | duplicate canonical URL of index.html |
| index-polaris.html | archived | duplicate canonical URL of index.html |
| apgi-landing.html | future | not in live nav; needs a product decision — paid-traffic landing page or stale draft? (INVENTORY.md open question) |
| Landing-Page.html | archived | broken design-canvas export, requires a React runtime nothing loads |
| APGI-Landing-Page.html | archived | same as above, near-duplicate of Landing-Page.html |
| framework-paper.html | stays | — |
| apgi-signature.html | internal | CRITICAL claim-discipline findings (public OCD/Psychosis/MDD/Anxiety preset simulator exposing gated parameters, CLAIM_AUDIT.md A-3/D-5) — stays *internal* until remediated, then → stays |
| apgi_protocol_reference.html | future | strong content, zero inbound links — needs a nav-placement decision before it can ship as a reachable page |
| how-to-falsify-apgi.html | future | strong content, zero inbound links — same as above |
| papers-index.html | stays | — |
| liquid-networks-paper.html | stays | — |
| lquid-networks-paper.html | stays | working typo-redirect shim to liquid-networks-paper.html, correctly unlisted |
| multi-scale-consciousness-paper.html | internal | PTSD/Depression/Dissociation/Autism tags + "intervention targets" language (CLAIM_AUDIT.md A-6) — internal until fixed, then → stays |
| epistemic-architecture-paper.html | stays | good example of properly hedged thermodynamic framing |
| apgi-series.html | stays | working redirect shim to papers-index.html |
| book-outline.html | internal | broken cross-link to book-available-now.html (case mismatch) — internal until fixed, then → stays |
| book-available-now.html | internal | broken image reference + "available now"/"coming soon" contradiction — internal until fixed, then → stays |
| apgi-software-system.html | internal | live nav page, but carries an unbacked "scientifically validated" overclaim (CLAIM_AUDIT.md C-1) — internal until fixed, then → stays |
| apgi-software.html | archived | duplicate of apgi-software-system.html, canonical points to a URL that doesn't exist |
| app-explorer.html | internal | "scientifically-validated" overclaims (C-1) plus a second, inconsistent 8-profile taxonomy — internal until fixed, then → stays |
| app-appendix.html | internal | low-severity TOC label issue (A-9) — internal until fixed, then → stays |
| apgi-experiments.html | internal | "Validated Experiments"/"empirical grounding" overclaim (C-1) — internal until fixed, then → stays |
| apgi-assessment.html | internal | **CRITICAL** — live gated-parameter delivery (D-1) + fabricated normative database (E-1) + a debug leak (`window.testCalculations`) — internal, blocking, until all three are fixed, then → stays |
| assessment-onepage.html | internal | **CRITICAL** — raw parameter delivery (D-2) + "risk of anxiety" language (A-5); also product-undecided whether it ships at all |
| quiz-signature.html | internal | **CRITICAL** — source of the 7-profile system (2 of 7 names clinical-resonant) + raw parameter delivery (D-3) |
| state-assessment.html | internal | **CRITICAL** — results literally named "Anxiety"/"Depression" (A-4) + raw parameter delivery (D-4) |
| book-outline.html | *(listed above)* | — |
| contact.html | internal | form has no `action=` attribute, JS-driven submission unverified end-to-end — internal until verified, then → stays |
| privacy-policy.html | stays | confirm text matches actual data/export behavior once finalized (non-blocking) |
| terms-of-service.html | internal | two dead placeholder links (Cookie Policy, Accessibility) — internal until those pages exist or the links are removed, then → stays |
| sitemap.html | internal | currently the only page linking to 4 blocked quiz variants — needs a rewrite once Phase 0 remediation lands |
| sitemap.xml | internal | casing mismatches will 404 on a case-sensitive Linux host — internal (launch-blocking) until fixed, then → stays |
| robots.txt | stays | correct as-is |
| 404.html | stays | — |
| funnels.html | future | not in live nav — needs a decision: public launcher, or deindex like `_internal`? |
| favicon.ico | stays | — |
| favicon.svg | stays | — |
| support.js | archived | tied to the two broken Landing-Page drafts; not deployable, requires a React runtime nothing loads |
| BOOKING-README.md | archived | documents a confirmed-unrelated "Quick Book" demo product |
| booking-index.html | archived | off-brand, and its own hub link is broken (`booking-design-showcase.html` doesn't exist) |
| booking-modern-saas.html | archived | off-brand demo prototype |
| booking-dark-scientific.html | archived | off-brand demo prototype |
| booking-warm-approachable.html | archived | off-brand demo prototype |
| booking-bold-minimalist.html | archived | off-brand demo prototype |
| consciousness-visualization.html | future | thin static content per prior rating; needs an explanatory-fallback pass before it's launch-ready — no blocking claim-discipline finding, but not confirmed shippable as-is |
| neuromodulatory-cascade.html | future | same category as above — canvas-scripted, thin static copy, needs a content pass |
| TODO.md | internal | project task-tracking doc, not deployed |
| INVENTORY.md | internal | this audit's own deliverable, not deployed |
| CLAIM_AUDIT.md | internal | this audit's own deliverable, not deployed |
| DEPLOY_PLAN.md | internal | this audit's own deliverable, not deployed |
| FILE_MANIFEST.md | internal | this file |
| TASKS.md | internal | companion task list, not deployed |
| .gitignore | internal | tooling config |
| .env.security.example | internal | deployment reference doc (CSP env var template), not public-facing |

## `funnels/`

| file | verdict | note |
|---|---|---|
| funnels/1_individual_self_explorers.html | stays | — |
| funnels/2_therapists_coaches.html | internal | **CRITICAL** — fabricated NBCC/APA/NASW accreditation badges + unverifiable clinical testimonial (A-2/E-2) |
| funnels/3_academic_researchers.html | internal | **CRITICAL** — self-contradicting fabricated publication claims (E-3) |
| funnels/4_organizational_development.html | future | thin/generic content per prior rating, no blocking claim-discipline finding — needs a content pass, not a legal one |
| funnels/5_educational_institutions.html | internal | "Wellness Integration"/"holistic" language (B-1) — internal until fixed, then → stays |
| funnels/6_healthcare_professionals.html | internal | **CRITICAL, highest-risk finding in the audit** — unqualified FDA classification claim + fabricated journal citations (A-1/E-4) |
| funnels/7_tech_industry_professionals.html | future | vague technical offer per prior rating — content pass needed, not blocking |
| funnels/_internal/1_individual_self_explorers_journey.html | archived | internal ad-campaign mockup, correctly excluded from sitemap/robots |
| funnels/_internal/2_therapists_coaches_journey.html | archived | same |
| funnels/_internal/3_academic_researchers_journey.html | archived | same |
| funnels/_internal/4_organizational_development_journey.html | archived | same |
| funnels/_internal/5_educational_institutions_journey.html | archived | same |
| funnels/_internal/6_healthcare_professionals_journey.html | archived | same |
| funnels/_internal/7_tech_industry_professionals_journey.html | archived | same |
| funnels/_internal/ad-display.html | archived | internal ad board |
| funnels/_internal/social-media-ads.html | archived | broken — references 7 images under `assets/images/ads/` that don't exist anywhere in the repo |

## `_ds/` (design-canvas export)

| file | verdict | note |
|---|---|---|
| _ds/apgi-design-system-.../_adherence.oxlintrc.json | archived | tool config for a design-canvas export, only consumed by the broken Landing-Page drafts |
| _ds/apgi-design-system-.../_ds_bundle.js | archived | same |
| _ds/apgi-design-system-.../_ds_manifest.json | archived | same |
| _ds/apgi-design-system-.../readme.md | archived | same |
| _ds/apgi-design-system-.../styles.css | archived | same |
| _ds/apgi-design-system-.../tokens/colors.css | archived | same |
| _ds/apgi-design-system-.../tokens/fonts.css | archived | same |
| _ds/apgi-design-system-.../tokens/interaction.css | archived | same |
| _ds/apgi-design-system-.../tokens/spacing.css | archived | same |
| _ds/apgi-design-system-.../tokens/typography.css | archived | same |

## `assets/css/`

Verified by direct `<link>` reference tracing (corrects the earlier "not cross-checked" UNDECIDED status in INVENTORY.md):

| file | verdict | note |
|---|---|---|
| assets/css/navigation.css | stays | referenced by 10 pages, live |
| assets/css/tailwind-built.css | stays | referenced by 7 pages, live (4238 lines — large but live) |
| assets/css/tailwind-fallback.css | stays | referenced by 7 pages, live (CDN-fallback pair for tailwind-built.css) |
| assets/css/fontawesome-fallback.css | stays | referenced by 5 pages, live |
| assets/css/fonts-fallback.css | stays | referenced by 5 pages, live |
| assets/css/design-system.css | stays | referenced by 3 pages, live |
| assets/css/unified-buttons.css | future | only 1 confirmed reference (funnels/5_educational_institutions.html) — is this meant to roll out sitewide, or is `buttons.css` the intended replacement? Needs a decision. |
| assets/css/buttons.css | archived | **correction to the earlier pass**: zero real references — the 1 hit found earlier was a false-positive substring match inside `unified-buttons.css`'s own filename. Confirmed dead. |
| assets/css/fallbacks.css | archived | zero references anywhere |
| assets/css/input.css | archived | zero references anywhere |

## `assets/images/`

Verified by direct reference tracing:

| file | verdict | note |
|---|---|---|
| assets/images/APGI-Experiments-1.png | stays | 2 confirmed references |
| assets/images/APGI-Experiments-2.png | stays | 2 confirmed references |
| assets/images/App-Appendix.png | stays | 2 confirmed references |
| assets/images/App-Explorer.png | stays | 2 confirmed references |
| assets/images/APGI-Software-System.png | stays | 3 confirmed references |
| assets/images/2-APGI-Framework-Diagram.png | internal | **new finding**: this file is never referenced by its actual filename anywhere. Every page's `og:image` meta tag instead points to `assets/images/APGI-Framework-Diagram.png` (no "2-" prefix) — a file that doesn't exist. This is a **sitewide broken Open Graph preview image**, confirmed across all ~35 pages that carry an `og:image` tag, not just the single instance flagged in the earlier pass (`book-available-now.html`'s inline `<img>`). Fix: either rename this file to match what every page expects, or fix all ~35 `og:image` tags to point to this file's real name — the former is one file change, the latter is 35. |
| assets/images/APGI-Framework-Diagram.svg | future | zero references found; may be an intended replacement for the PNG above, or an orphaned asset — needs a decision alongside the fix above |
| assets/images/Evolutionary-Mismatch.svg | future | zero direct-reference hits found (a broader text search for "mismatch" hits several theory pages, but that reads as the conceptual term "evolutionary mismatch," not confirmed image usage — not fully verified either way) |
| assets/images/mismatch.jpg | future | same caveat as above — not confirmed live or dead with full certainty |

## `assets/security/`

| file | verdict | note |
|---|---|---|
| assets/security/security-headers.txt | internal | deployment reference doc (Apache/Nginx CSP header template), not public-facing |

## `assets/js/` — verified live (20 files)

Corrects the earlier pass, which undercounted the live set (it named ~8 of these explicitly and grouped the rest). Confirmed live via direct `<script src>`, or genuine dynamic loading by a live script:

| file | verdict | note |
|---|---|---|
| assets/js/accessibility-enhancer.js | stays | directly script-tagged, live |
| assets/js/cdn-fallbacks.js | stays | directly script-tagged, live; dynamically injects the 6 fallback files below |
| assets/js/data-export-service.js | stays | directly script-tagged, live |
| assets/js/environment-config.js | stays | directly script-tagged, live; several other unwired files expect it to load first |
| assets/js/export-ui.js | stays | directly script-tagged, live (TODO.md references its "Copy Button" pattern) |
| assets/js/form-handler.js | stays | directly script-tagged, live — backs contact.html's form |
| assets/js/navigation.js | stays | directly script-tagged, live |
| assets/js/offline-quiz-manager.js | stays | directly script-tagged, live |
| assets/js/performance-optimizer.js | stays | directly script-tagged, live; dynamically imports visualization-components.js |
| assets/js/progress-tracker.js | stays | directly script-tagged, live |
| assets/js/theme-manager.js | stays | directly script-tagged, live |
| assets/js/unified-theme-manager.js | stays | directly script-tagged, live |
| assets/js/funnel-tracking.js | stays | script-tagged from 2 funnel pages, live |
| assets/js/visualization-components.js | stays | **correction to the earlier pass** — not dead; dynamically `import()`-ed at runtime by the live performance-optimizer.js |
| assets/js/chartjs-fallback.js | stays | injected by the live cdn-fallbacks.js |
| assets/js/lucide-fallback.js | stays | injected by the live cdn-fallbacks.js |
| assets/js/plotly-fallback.js | stays | injected by the live cdn-fallbacks.js |
| assets/js/react-dom-fallback.js | stays | injected by the live cdn-fallbacks.js |
| assets/js/react-fallback.js | stays | injected by the live cdn-fallbacks.js |
| assets/js/recharts-fallback.js | stays | injected by the live cdn-fallbacks.js |

## `assets/js/` — confirmed dead, no scaffolding intent visible (archived)

| file | verdict | note |
|---|---|---|
| assets/js/enhanced-cdn-fallbacks.js | archived | unreferenced; internally points at 3 files that don't exist on disk at all |
| assets/js/d3-fallback.js | archived | **correction to the earlier pass** — its only reference is inside the dead enhanced-cdn-fallbacks.js, not the live cdn-fallbacks.js. Not actually reachable. |
| assets/js/performance-optimizer-v2.js | archived | unreferenced; superseded by the live (non-v2) performance-optimizer.js |
| assets/js/lazy-quiz-loader.js | archived | unreferenced; its target (quiz.js) is also dead |
| assets/js/quiz.js | archived | only reachable through the dead lazy-quiz-loader.js |
| assets/js/dropdown-navigation.js | archived | unreferenced, no clear feature tie |
| assets/js/image-converter.js | archived | unreferenced, no clear feature tie |
| assets/js/data-extraction.js | archived | unreferenced, no clear feature tie |
| assets/js/polyfills.js | archived | unreferenced, no clear feature tie |
| assets/js/ui-components.js | archived | unreferenced, no clear feature tie |
| assets/js/ui-components-examples.js | archived | unreferenced, no clear feature tie |

## `assets/js/` — confirmed dead but tied to a coherent unwired feature (future)

These form recognizable feature clusters that were built but never wired into any page — worth a roadmap decision (build it out, or remove it) rather than defaulting to deletion:

| file | verdict | note |
|---|---|---|
| assets/js/auth-service.js | future | unwired auth feature |
| assets/js/security-manager.js | future | referenced only in a comment inside the also-dead auth-service.js; paired feature |
| assets/js/api-services.js | future | unwired API-client layer, expects environment-config.js (which is live) |
| assets/js/enhanced-api-services.js | future | same cluster as above |
| assets/js/payment-service.js | future | unwired payments feature, expects environment-config.js (live) |
| assets/js/recaptcha-helper.js | future | unwired — TODO.md explicitly lists reCAPTCHA verification as a security task to implement |
| assets/js/site-search.js | future | unwired site-search feature |
| assets/js/analytics.js | future | unwired analytics; note this becomes a Cookie Policy compliance requirement the moment it's activated (see DEPLOY_PLAN.md gap analysis) |
| assets/js/error-analytics.js | future | unwired error-monitoring cluster |
| assets/js/error-boundary.js | future | same cluster |
| assets/js/error-logger.js | future | same cluster |
| assets/js/global-error-handler.js | future | same cluster |
| assets/js/health-monitor.js | future | same cluster |
| assets/js/logger.js | future | same cluster |
| assets/js/console-utility.js | future | same cluster |
| assets/js/assessment-functionality.js | future | possibly an alternate/legacy quiz engine — apgi-assessment.html (the live quiz) appears to use its own inline script rather than this file; confirm whether this is superseded before removing |
| assets/js/assessment-questions.js | future | same cluster as above |
| assessment-quiz.js (assets/js/assessment-quiz.js) | future | same cluster as above |
| assets/js/quiz-functionality.js | future | same cluster as above |

## `assets/js/` — dev/debug tooling (internal)

| file | verdict | note |
|---|---|---|
| assets/js/sri-hash-generator.js | internal | dev utility for generating Subresource Integrity hashes against CDN libs — not a deployed asset |
| assets/js/test-suite.js | internal | dev testing harness |
| assets/js/webhook-tester.js | internal | dev debug tool |

---

## Corrections this pass made to the earlier automated inventory

1. **13 additional JS files are actually live** (accessibility-enhancer, cdn-fallbacks, data-export-service, environment-config, export-ui, form-handler, navigation, offline-quiz-manager, performance-optimizer, progress-tracker, theme-manager, unified-theme-manager, funnel-tracking) that the earlier pass's "32 unreferenced files" framing didn't distinguish from the truly dead set.
2. **`visualization-components.js` is live**, not dead — reachable via a dynamic `import()` inside the live `performance-optimizer.js`. The earlier pass's grep-based check missed this because it only checked static `<script src>` patterns.
3. **`d3-fallback.js` is dead**, not live — it's only referenced inside the already-dead `enhanced-cdn-fallbacks.js`, not the live `cdn-fallbacks.js`. The earlier pass grouped it with the genuinely-live fallback files by assumption rather than verification.
4. **`buttons.css` is dead**, not referenced — the earlier "1 reference" was a false-positive substring match against `unified-buttons.css`'s own filename.
5. **New finding, not previously flagged**: the Open Graph preview image (`assets/images/APGI-Framework-Diagram.png`, referenced via `og:image` meta tag) is broken on essentially every page site-wide — the real file on disk is `2-APGI-Framework-Diagram.png`. The earlier pass only caught the same broken filename inside one page's inline `<img>` tag (`book-available-now.html`), not the sitewide meta-tag pattern. This is now tracked as its own item in [TASKS.md](TASKS.md).

## Verdict counts

| verdict | count |
|---|---|
| stays | 39 |
| archived | 34 |
| internal | 28 |
| future | 28 |
| **total** | **129** (excludes 19 root/dotfiles/config counted individually above but not itemized in this summary table: `.claude/`, `.vscode/`, `.gitignore`, and the 6 audit-deliverable `.md` files, all `internal`) |
