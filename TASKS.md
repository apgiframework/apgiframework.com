# APGI Implementation Tasks

## 0. Completed — round 2 (deployment + remaining Phase 0/1 items)

- [x] Deployed both services live: GCP project `apgiframework-web` created, Cloud SQL + Memorystore Redis + Secret Manager + Cloud Run (both services) provisioned, DNS mapped for `www.apgiframework.com` and `api.apgiframework.com`. Full detail in [INFRASTRUCTURE.md](INFRASTRUCTURE.md).
- [x] Archived confirmed-duplicate/broken files into `_archive/` (not deleted — recoverable): `index-apgi.html`, `index-polaris.html`, `Landing-Page.html`, `APGI-Landing-Page.html`, `apgi-software.html`, `support.js`, `_ds/`.
- [x] Excluded `funnels/_internal/` and the remaining CRITICAL-blocked pages (`apgi-signature.html`, `state-assessment.html`, `quiz-signature.html`, `assessment-onepage.html`, `apgi-assessment.html`, `funnels/2_therapists_coaches.html`, `funnels/6_healthcare_professionals.html`) from the deployed Docker image — they stay in source, just aren't publicly reachable until their CLAIM_AUDIT.md findings are resolved.
- [x] Fixed the sitewide OG-image bug (renamed `2-APGI-Framework-Diagram.png` → `APGI-Framework-Diagram.png`, fixing all 36 references in one change instead of 36 edits).
- [x] Verified (re-grepped, confirmed absent): UC Berkeley/R21 grant quote, Johns Hopkins/FDA claim, TechForward Inc./HBR citation, MindfulTech CEO testimonial, `alert('coming soon')` CTAs on funnels 2–4, dead `#contact` CTAs on funnels 5–7, ~130 broken PDF links on `apgi-series.html` (it's a 16-line redirect shim, not a content page), legacy filename links (`Home.html` etc.) anywhere live.
- [x] Verified `book-available-now.html`'s buy links already point to real Gumroad product pages, not marketplace homepages.
- [x] Verified the Stripe key in `funnels/1_individual_self_explorers.html` is a literal placeholder string (`pk_test_placeholder_publishable_key`), not a real key of any kind — no rotation needed.
- [x] Verified the Zenodo DOI (`10.5281/zenodo.21632264`) is a confirmed version DOI (v1.0), not a concept DOI — no concept DOI exists yet for this single-version deposit. Filled in the real creator name (Pesochin, Dimitry) in `CITATION.cff`, previously a placeholder.
- [x] Set up uptime checks + alert policies + an email notification channel for both services.
- [x] Created a Cloud Build ↔ GitHub connection object — **one browser step left for the operator** (GitHub App authorization) before the auto-deploy trigger itself can be wired up.
- [x] Wrote [INFRASTRUCTURE.md](INFRASTRUCTURE.md): every resource actually provisioned, the IAM grants made and why, and secret rotation guidance.
- [x] Re-ran the sitewide broken-link crawl (424 refs checked) — down to 15 remaining hits, all on already-tracked non-live surfaces (`_archive/`, `funnels/_internal/`, the still-pending booking-cluster decision).

## 1. Completed — round 1

Implemented, committed, and pushed — cross-checked against the docx-sourced phased task list ("Tasks and Current Status" in the updated governing doc), filtered to items doable without further operator input:

- [x] Replaced `index.html` with a "coming soon" placeholder (Neural Glow styling, logo, no fabricated authority markers); original content preserved at `home-full.html`.
- [x] Removed the fabricated "2,847-person validation database" / "47+ peer-reviewed studies" style claims from `funnels/3_academic_researchers.html` (journal list, Cronbach's α/test-retest figures, N=2,847/N=312 footnotes, "Preferred partner for NSF, NIH" claim) — see CLAIM_AUDIT.md E-3.
- [x] Removed the "anonymous normative database (N=1,247)" claim from `apgi-assessment.html`'s pre-quiz copy and relabeled the underlying `NORMATIVE_DATA` object as an explicit non-real placeholder (n:0). **Note:** the deeper D-1 fix (stripping the raw parameter/percentile results screen itself) is still open — this was scoped narrowly to the specific claim named in this task, not the full D-1 remediation.
- [x] Drafted `FORBIDDEN_LANGUAGE.md` (wellness + clinical + a new "unbacked authority claims" category) — flagged a real conflict: the `apgi-design` skill's own brand-voice guidance recommends the exact "47 peer-reviewed studies" style claim that's being removed as fabricated.
- [x] Scanned `apgiframework.com`'s full git history for committed secrets — clean (2-commit history, one doc comment referencing `pk_live_*` as an example, no real credentials).
- [x] Created `IDENTIFIERS.md` (canonical identifier block: ORCID, OSF project/registration, Zenodo DOI, GitHub org, site/API URLs) and wired it into `README.md` and `CITATION.cff` (new files — this repo had neither before).
- [x] Rebuilt `assets/js/navigation.js` as a real shared nav component — it was previously broken (fetched a nonexistent `components/navigation.html`, fell back to hardcoded dead legacy links like `Home.html`/`Quiz.html`/`Paper.html`). Wired it into the 6 "stays" pages that had no nav at all (`404.html`, `funnels.html`, `book-outline.html`, `app-explorer.html`, `privacy-policy.html`, `terms-of-service.html`). Left `papers-index.html`/`apgi-experiments.html` (own custom nav) and the 4 paper pages/legal-adjacent pages with a deliberate "back to index" reader pattern untouched — see the new item in §2 below for full nav standardization as a separate follow-up decision.
- [x] Added missing meta description + canonical + OG tags to `apgi_protocol_reference.html`.
- [x] Checked `consciousness-visualization.html` and `neuromodulatory-cascade.html` for root-relative path bugs — none found; already correct.
- [x] Checked heading hierarchy (h1→h2→h3) on the four paper pages — already clean, no h2→h4 skip found.
- [x] Checked the APGI acronym expansion sitewide — already consistent ("Allostatic Precision-Gated Ignition" everywhere), no fix needed.
- [x] Pinned CDN library versions: Chart.js → `4.5.1` (3 files), Lucide → `1.40.0` (10 references across 7 files); both verified to resolve (HTTP 200). Tailwind's Play CDN (`apgi-signature.html` only) cannot be pinned by design (Tailwind's own docs: dev-only, always serves latest) — documented inline with a migration recommendation to the existing local `assets/css/tailwind-built.css`.
- [x] Ran a full local/relative broken-link crawl (542 references checked) — no new actionable breaks found on live, unblocked pages; all hits were on already-archived/blocked pages or already-tracked issues (the sitewide OG-image bug, the booking cluster, `apgi-software.html`'s dead links).
- [x] Ran Lighthouse against 3 representative pages (via local server + `npx lighthouse`):
  - `index.html` (coming-soon): Performance 91, Accessibility 100, Best Practices 100, SEO 66 (deliberately `noindex`'d — expected, not a bug), Best Practices 100.
  - `papers-index.html`: Performance 87, Accessibility **81**, Best Practices 100, SEO 100. Failing audits: `color-contrast`, `heading-order`, `landmark-one-main` — **new finding, not previously tracked**, added to §2 below.
  - `privacy-policy.html`: Performance 100, Accessibility 91, Best Practices 100, SEO 100.
  - Full Lighthouse pass across all ~130 retained pages was not run (would be a large, separate effort) — this was a representative sample per the task's own framing ("run a Lighthouse pass on the retained pages," not "every page").

Several items from the docx's Phase 0A/1 list were checked and found **already resolved / not present** in the current repo (not new work done this session, but verified): the UC Berkeley/R21 grant quote, Johns Hopkins/FDA claim, "TechForward Inc." case study, "MindfulTech CEO" testimonial, the hardcoded Stripe key in `funnels/1` (confirmed a harmless placeholder string, not a real key), broken links to `Home.html`/`Assessment.html`/`Quiz.html`/`Profile.html`/`Paper.html`/`SCI/`, `APGI-Series.html`'s ~130 broken PDF links, `alert('coming soon')` CTAs on funnels 2–4, and dead `#contact` CTAs on funnels 5–7.

---

## 1. BLOCKING — claim-discipline remediation

### 1a. apgiframework.com

- [ ] **CRITICAL** — `apgi-signature.html`: rename the 4 clinical presets ("Anxiety," "OCD," "Psychosis," "Depression"/"MDD Signature") to non-clinical labels; remove "disorder" from the page's own definition line (L75). See CLAIM_AUDIT.md A-3/D-5.
- [ ] **CRITICAL** — `state-assessment.html`: rename the two delivered results currently named "Anxiety" and "Depression" (L1069/1095) and strip their clinical mechanism text (L2085–2087). See A-4.
- [ ] **CRITICAL** — `apgi-assessment.html`: strip the raw ε/π/β/θ scores, 95% CIs, and percentiles from the results screen (L901–1146) and the PDF export (L3757–3810) until K7 passes. See D-1.
- [x] **PARTIALLY DONE** — `apgi-assessment.html`: the front-facing "N=1,247 anonymous normative database" claim (L724–727) is fixed and the underlying `NORMATIVE_DATA` object is now explicitly labeled as a non-real placeholder. **Still open:** the percentile/CI results screen itself (L901–1146, PDF export L3757–3810) still computes and displays numbers derived from that placeholder data — the "do not ship a percentile display backed by it" half of this item is the bigger D-1 fix, not done here. See E-1/D-1.
- [ ] **CRITICAL** — `apgi-assessment.html`: remove the debug leak `window.testCalculations` (L3889) — structural, not claim-discipline, but blocking either way.
- [ ] **CRITICAL** — `assessment-onepage.html`: strip raw parameter values from the "Your APGI Parameter Profile" block (L1738–1777) and the generated recommendation text (L2221, L2366). See D-2.
- [ ] **CRITICAL** — `assessment-onepage.html`: rewrite the "risk of anxiety/hypervigilance" and "vulnerable to somatic anxiety" lines (L2302, L2326). See A-5.
- [ ] **CRITICAL** — `quiz-signature.html`: remove the "Parameter Signature" panel and per-item 0–100 scores tied to θ/ε/π/β (L745–789, L835–853). See D-3.
- [ ] **CRITICAL** — `quiz-signature.html`: fix the 2 of 7 archetype names/descriptions with clinical resonance ("The Hypervigilant Analyst," "The Anxious Reactor," and the "Anxiety loops" phrase inside "The Overloaded Scanner"'s failure list) — see §0 of CLAIM_AUDIT.md for the full per-profile assessment.
- [ ] **CRITICAL** — `state-assessment.html`: strip the raw `val-e`/`val-p`/`val-t`/`val-b` numeric+verbal display (L2033–2058). See D-4.
- [ ] **CRITICAL** — `funnels/6_healthcare_professionals.html`: remove the FDA regulatory classification claim and the three fabricated journal citations (L512–517); remove or rewrite the "Clinical," "Treatment," "HIPAA Compliance" framing throughout. **Route through legal/regulatory review before republishing in any form** — see §5 (human action). See A-1/E-4.
- [ ] **CRITICAL** — `funnels/2_therapists_coaches.html`: remove the fabricated NBCC/APA/NASW accreditation badges (L1099–1101) and the unverifiable "Dr. Sarah Chen, Clinical Psychologist" testimonial (L969–970); remove the unbacked APA-attributed retention statistic (L867–869). See A-2/E-2.
- [x] **DONE** — `funnels/3_academic_researchers.html`: removed the "Journals Featuring APGI Research" list, the Cronbach's α/test-retest figures, the N=2,847/N=312/47-countries footnotes, the "internal normative database" pricing bullet, and the "Preferred partner for NSF, NIH" claim. Replaced with honest pre-registration/pilot-phase framing throughout. See E-3.
- [ ] HIGH — `multi-scale-consciousness-paper.html`: reframe L925's "intervention targets" language and the PTSD/Depression/Dissociation/Autism tags (L931–958) as illustrative/theoretical, not clinical. See A-6.
- [ ] HIGH — `framework-paper.html`: hedge the declarative "explaining"/"biomarkers" language at L932, L979, L1002–1004. See A-7.
- [ ] HIGH — sitewide: replace "scientifically validated" claims with hedged language to match the disclaimer already present on the homepages — hits in `app-explorer.html` (L709, L744, L1090), `apgi-software.html`/`apgi-software-system.html` (L641/equivalent), `apgi-experiments.html` (L883). See C-1.
- [ ] MEDIUM — `funnels/5_educational_institutions.html`: rewrite "Wellness Integration"/"holistic student care" (L311–315). See B-1.
- [ ] LOW — `app-appendix.html`: consider renaming the "Clinical applications and psychiatric disorders" TOC label (L920) — low severity, not blocking. See A-9.
- [ ] LOW — `liquid-networks-paper.html`: soften the present-tense "Disorders of Consciousness" application card (L955–958) to a hedged future-possibility framing. See A-11.
- [ ] LOW — `apgi-api/web/checkout.html`: drop the "Favorable somatic bias registered" flavor text (L575) — normalizes a gated term even in a low-stakes context. See D-10.
- [ ] Follow-up, not blocking: confirm the canonical Neural Glow wellness/spiritual forbidden-word list against the `apgi-design` skill — CLAIM_AUDIT.md's Category B findings are heuristic without it.
- [ ] Re-run the CLAIM_AUDIT.md verification pass (same file list, same term greps) after the above land, before Phase 1 of DEPLOY_PLAN.md starts.

### 1b. apgi-api

- [ ] **CRITICAL** — `app/routes/state.py`: add a K7-gate check (feature flag / capability check keyed to per-parameter identifiability status) in front of `GET /v1/sessions/{id}/state`, `/interoception`, `/prediction-errors`, `/somatic-markers`. Until a parameter clears K7, it must be **absent** from the response (not null, not present-with-caveat) — governing doc §3.6's own allow-list model. See CLAIM_AUDIT.md D-7/D-8.
- [ ] **CRITICAL** — `app/models/schemas.py`: update `PrecisionState`, `IgnitionState`, `SystemStateResponse`, `PredictionErrorsResponse`, `SomaticMarkersResponse` to support the allow-list gating above (fields conditionally omitted, not defaulted to zero/null).
- [ ] HIGH — `docs/THEORY.md`: add hedging language to the 6 identified lines that state APGI's consciousness constructs as established fact rather than a theoretical model (e.g. "the neural signature of consciousness," "APGI is a neuroscientific theory of consciousness").
- [ ] MEDIUM — `web/Landing.html`: rewrite marketing copy advertising raw parameter delivery (L341, L465, L514, L577) to match whatever the gated API actually returns once 1b's first two items land. See D-9.

---

## 2. Structural fixes — apgiframework.com

- [ ] **New finding (Lighthouse pass, this session)** — `papers-index.html` scores Accessibility 81/100, failing `color-contrast`, `heading-order`, and `landmark-one-main` (no `<main>` landmark). Not fixed this session — contrast fixes need care against the brand-locked Neural Glow palette; recommend a dedicated accessibility pass across all "stays" pages rather than a one-off fix here.
- [ ] **New finding (nav audit, this session)** — nav patterns are inconsistent sitewide: 11 pages use the shared `.main-nav` component/markup, 6 more were wired to it this session, but `papers-index.html` and `apgi-experiments.html` have their own distinct custom nav bars, and the 4 paper pages plus `funnels/1_individual_self_explorers.html` use a minimal "back to index" pattern. Left alone this session because collapsing them into one pattern is a design decision (would remove intentional-looking variation), not a mechanical fix — flagging for an explicit product/design call.
- [ ] **Sitewide, launch-blocking**: fix `assets/images/APGI-Framework-Diagram.png` — every page's `og:image` meta tag references this exact filename, but the real file on disk is `2-APGI-Framework-Diagram.png`. Either rename the file (1 change) or fix ~35 meta tags (35 changes). **New finding this pass**, broader than the single instance flagged earlier.
- [ ] Fix `sitemap.xml` casing mismatches (e.g. `APGI-Assessment.html` vs. real `apgi-assessment.html`) — will 404 on a case-sensitive Linux production host even though it resolves fine locally on macOS.
- [ ] Fix `book-outline.html`'s broken cross-link at L961 (`Book-Available-Now.html#bundles` → `book-available-now.html#bundles`).
- [ ] Fix `book-available-now.html`'s broken image reference (`APGI-Framework-Diagram.png` → the actual `2-APGI-Framework-Diagram.png`, same root cause as the sitewide OG-image bug above) and resolve the "available now" vs. "coming soon" copy contradiction.
- [ ] Archive `index-apgi.html` and `index-polaris.html` (duplicate canonical of `index.html`); pick `index.html` as the sole canonical homepage.
- [ ] Archive `apgi-software.html` (duplicate of `apgi-software-system.html`, canonical points to a nonexistent `/software.html`).
- [ ] Delete `Landing-Page.html`, `APGI-Landing-Page.html`, `_ds/`, `support.js` — confirmed non-deployable (require a React runtime nothing loads).
- [ ] Delete or relocate the 6-file booking-prototype cluster (`booking-*.html` ×5 + `BOOKING-README.md`) — pending the roadmap question in §4.
- [ ] Rewrite `sitemap.html` to exclude internal/redirect/prototype/blocked pages once §1a lands.
- [ ] Verify `contact.html`'s form/env wiring end-to-end (no `action=` attribute today, JS-driven submission via `form-handler.js`).
- [ ] Fix `terms-of-service.html`'s two dead `href="#"` placeholder links (Cookie Policy, Accessibility) — either build the target pages (§6) or remove the links.
- [x] (Done) Delete `assets/js/enhanced-cdn-fallbacks.js`, `d3-fallback.js`, `performance-optimizer-v2.js`, `lazy-quiz-loader.js`, `quiz.js`, `dropdown-navigation.js`, `image-converter.js`, `data-extraction.js`, `polyfills.js`, `ui-components.js`, `ui-components-examples.js`, `assets/css/buttons.css`, `assets/css/fallbacks.css`, `assets/css/input.css` — confirmed dead with no scaffolding intent (see FILE_MANIFEST.md for the verification behind each).

---

## 3. Product/roadmap decisions needed before further work

- [ ] Is a booking/scheduling feature actually on the APGI roadmap? Determines archive-with-rebuild-note vs. permanent delete for the booking cluster.
- [ ] Which of `assessment-onepage.html`, `quiz-signature.html`, `state-assessment.html`, `apgi-signature.html` launch alongside `apgi-assessment.html` once §1a is fixed, and which are retired?
- [ ] Is `apgi-landing.html` a real paid-traffic landing page or a stale draft? Not in live nav today.
- [ ] Is `funnels.html` meant to be a public launcher (add to nav) or should it be deindexed like `funnels/_internal/`?
- [ ] Which unwired JS feature clusters in `assets/js/` (auth, payments, error-monitoring, analytics, site-search, recaptcha, the legacy quiz engine) are on a near-term roadmap vs. safe to delete? See FILE_MANIFEST.md's "future" section for the full per-file breakdown.
- [ ] `assets/css/unified-buttons.css` vs. the confirmed-dead `assets/css/buttons.css` — is `unified-buttons.css` meant to roll out sitewide (currently only 1 page uses it)?
- [ ] `assets/images/APGI-Framework-Diagram.svg`, `Evolutionary-Mismatch.svg`, `mismatch.jpg` — confirm live/dead status and intended use (not fully verified this pass).
- [ ] `apgi-api`: is `app/services/task_executor.py` or `app/services/task_execution/task_executor.py` authoritative? (Possible dead duplicate.)
- [ ] `apgi-api`: is `app/tasks/experimental_tasks.py` production-bound or scaffolding that should be renamed/flagged?
- [ ] `apgi-api`: is `tests/e2e/`'s empty scaffold (conftest only, zero test files) planned or abandoned?
- [ ] `apgi-api`: confirm `pyproject.toml`'s `--cov-fail-under=100` is intentional and currently achievable.
- [ ] `apgi-api`: `deployment/kubernetes/redis-cluster.yaml` — Cloud Run + Memorystore, or a genuine intent to self-host Redis? Needed before Phase 7 of DEPLOY_PLAN.md.
- [ ] `apgi-api`: does `docs/DEPLOYMENT.md` reference the stale AWS terraform/K8s? Needs a rewrite pass alongside the infra rewrite either way.

---

## 4. Missing pages — apgiframework.com

- [x] Build an **About** page — `about.html`, linked from the homepage and shared navigation.
- [x] Link to the canonical **API docs** at `https://api.apgiframework.com/docs` from the homepage, shared navigation and information pages. Keep `apgi_protocol_reference.html` as a research reference with an explicit API-docs link. Backend documentation retirement remains a separate `apgi-api` task.
- [x] Build a **Cookie Policy** page — `cookie-policy.html`; legal and homepage links wired. Optional analytics remains disabled; provider inventory and applicable consent controls are prerequisites to activation.
- [x] Build an **Accessibility Statement** page — `accessibility.html`; documents the target, known limitations and reporting route without claiming conformance.

---

## 5. Security & infrastructure — carried over from TODO.md, still outstanding

- [ ] HSTS header — web server deployment
- [ ] CSRF token validation — server-side verification on state-changing requests
- [ ] Rate limiting — 5/min on login, 3/hour on password reset
- [ ] Account lockout — lock after 10 failed attempts (30-min cooldown)
- [ ] Password reset expiration — 24-hour expiration, one-time use
- [ ] Session management — HttpOnly cookie auth & validation
- [ ] reCAPTCHA verification — backend token verification (pairs with `assets/js/recaptcha-helper.js` in §3's roadmap list)
- [ ] Webhook signature verification — Stripe webhook security
- [ ] TLS/SSL certificate — valid certificate deployment (see DEPLOY_PLAN.md Phase 4)
- [ ] Security headers — web server configuration (Apache/Nginx) — note `assets/security/security-headers.txt` already documents the intended CSP; wire it into the actual server config
- [ ] Database permissions — least-privilege user access
- [ ] Access logging — security event logging & monitoring
- [ ] Secure configuration — environment variables for secrets (apgi-api already does this correctly in `app/config.py`; extend the same pattern frontend-side if any secrets end up there)

Most of these belong to `apgi-api`/the hosting layer rather than static HTML — cross-reference against DEPLOY_PLAN.md Phase 6 (monitoring) and Phase 7 (data-layer services) when scheduling.

---

## 6. UI/UX polish — carried over from TODO.md, still outstanding

- [ ] "Back to Top" button — floating button visible after 300px scroll
- [ ] Copy button on code blocks (pattern already exists in `export-ui.js`, confirmed live — extend its usage)
- [ ] Print stylesheet — optimized styles for printing
- [ ] Last-updated date — timestamp on content pages
- [ ] Expandable FAQ — collapsible Q&A sections
- [ ] Page loading animation — fade-in on load
- [ ] Toast notifications — dismissible toast messages
- [ ] Table of contents — auto-generated TOC for long pages
- [ ] Related-content links — "See Also" sections
- [ ] Floating contact widget — persistent chat/contact widget

---

## 7. apgi-api — structural/code tasks

- [ ] Delete `requirements-prod.txt` — confirmed stale, missing `stripe`/`pyotp`/`cryptography`/`aiohttp`; would break the build if the Dockerfile were ever switched to use it (it currently uses `requirements.txt`).
- [ ] Archive `web/Landing.html` and `web/API.html` — unwired, duplicate the real marketing/API-doc content that should live on `apgiframework.com`/its API-docs surface instead.
- [ ] Decide fate of `web/register.html` and `web/checkout.html` — both hardcode `http://127.0.0.1:8000`; either env-configure the API base URL for real use, or archive as dev scratch pages.
- [ ] Resolve `app/create_db.py` / `create_demo_user.py` / `reset_db.py` / `alter_alembic.py` shipping inside the prod image (Dockerfile currently `COPY app/` wholesale) — confirm intended or exclude via `.dockerignore`.
- [ ] Move or rename `app/tests/api_contract_tests.py` — lives inside `app/` rather than `tests/`, inconsistent with the rest of the suite.
- [ ] Run a `git filter-repo`/BFG pass to scrub the old `.env` blob still recoverable from git history (4 commits, `f3c25b5`→`0a6ad9d`) — low urgency given placeholder content, but real hygiene debt.

---

## 8. Deployment infrastructure — both repos (per DEPLOY_PLAN.md)

- [ ] Rewrite `apgi-api/deployment/terraform/main.tf` for GCP — the existing file targets AWS (VPC, RDS, ElastiCache) and cannot be adapted, only rewritten, before any staging deploy can proceed. See DEPLOY_PLAN.md Phase 3.
- [ ] Archive `apgi-api/deployment/kubernetes/postgres-shards.yaml` (conflicts with managed Cloud SQL target) and `hpa.yaml`/`service.yaml`/`deployment.yaml` if Cloud Run is adopted (redundant with serverless autoscaling).
- [ ] Implement the signed audit log for scoring/report access (governing doc §9.2.1) — does not exist anywhere in `apgi-api` today; the governing doc calls this "the cheapest of the seven controls and the highest-leverage." See DEPLOY_PLAN.md Phase 7.
- [ ] Implement the `cohort_type`-required norms service (governing doc §5) — replaces the fabricated `NORMATIVE_DATA` object flagged in §1a with a real, versioned pipeline.
- [ ] Implement the tested cascading-deletion job across Cloud SQL, Cloud Storage, and BigQuery (governing doc §7.4/§9.2.1) — run against a seeded test participant on every deploy in staging before trusting it in production.
- [ ] Migrate Celery workers from self-hosted to Cloud Run Jobs (`apgi-jobs`).
- [ ] Stand up Cloud Scheduler jobs for monthly re-scoring, retest reminders, norm refreshes.
- [x] **Decided, not doing:** no separate staging GCP project — operator explicitly declined the added infrastructure cost. `apgi-api` runs in `ENVIRONMENT=staging` *mode* within the single `apgiframework-web` project instead (see INFRASTRUCTURE.md) — good enough to skip requiring real Stripe/SMTP credentials, but there's no isolated environment to test destructive changes (like the cascading-deletion job below) against before they hit the only project that exists.
- [ ] Add a GCP deploy job to `apgi-api/.github/workflows/ci.yml` — currently lint/typecheck/security/test/build/docs only, no deploy step.

---

## 9. Human action required — cannot be automated, flagged per DEPLOY_PLAN.md

- [ ] Legal/regulatory review of `funnels/6_healthcare_professionals.html` and `funnels/2_therapists_coaches.html` before either is republished in any form (medical-device reclassification risk).
- [ ] Confirm domain registrar and current DNS provider for `apgiframework.com`.
- [x] Billing confirmed enabled on `apgiframework-web` (linked at project creation). No separate staging project — operator's explicit call, see §8.
- [ ] Grant IAM roles to the deploying identity on both GCP projects. For `apgiframework.com`, run the Workload Identity Federation setup in `.github/workflows/deploy.yml`'s header comment and add the two resulting values as `GCP_WORKLOAD_IDENTITY_PROVIDER`/`GCP_SERVICE_ACCOUNT` repo secrets — the workflow itself is wired up and waiting on this.
- [ ] OSF pre-registration (governing doc §0.1) — required before any pilot recruitment.
- [ ] Privacy lawyer review of the item bank (governing doc §7.2) — required given Article 9 special-category-data exposure (interoceptive/mood items).
- [ ] IRB approval — commercial IRB, university affiliation, or professional-association ethics committee (governing doc §7.3); attach the approval number to the OSF registration during the pilot phase, not later.
- [ ] Data-residency decision for EU participants (concrete GCP region choice).
- [ ] Decide and state in the consent text whether research consent is irrevocable for already-published aggregate results.
- [ ] Confirm the canonical Neural Glow wellness/spiritual forbidden-language list against the `apgi-design` skill (referenced by the governing doc, not found locally).

## Session log — delivery/hardening batch 2
- [x] nginx: `expires` replaces location-level `add_header Cache-Control`; verified on nginx 1.24 against an emulated image root (HSTS/XFO/CSP present on every response, held pages 404). Docker daemon was unavailable, so the container itself was not built.
- [x] Pinned remaining CDNs (Chart.js 3.9.1 + SRI in Dashboard-Acad, React 18.3.1, Tailwind Play 3.4.17, MathJax 3.2.2).
- [x] Rewrote `sitemap.html` to list public pages only and removed it from `.dockerignore`.
- [x] Excluded four prototype pages with unresolved links from the image; fixed the Terms `href="#"` link.
- [ ] Still open: ~30 other dead JS files in `assets/js/` pending the keep/delete cluster decision; contact endpoint `POST /api/contact` must exist in `apgi-api`.

## Session log — claim-discipline batch 3
- [x] quiz-signature: renamed to Reflection Quiz; removed parameter-signature panel, numeric scores and clinical archetype names.
- [x] assessment-onepage: removed parameter values, charts, interactions and recommendations; qualitative reflection summary only; removed Anxiety/somatic-anxiety wording.
- [x] state-assessment: renamed Anxiety/Depression/Dissociation states; removed val-e/p/t/b displays, radar chart, confidence %, mechanism text.
- [x] apgi-signature: removed OCD/Psychosis/Depression presets; hedged neural correlates.
- [x] apgi-assessment: removed raw scores, CIs, percentiles, radar chart, style card, recommendations (page + PDF). Open defect: scoring code still substitutes placeholder norm means when a task has no data; results now say "Not enough data" for those.
- [x] Therapist/healthcare/education funnels, book-outline testimonials, multi-scale/framework/liquid-networks/appendix wording rewritten or hedged.
- [ ] Open: checkout wording (apgi-api), canonical forbidden-language list reconciliation, a final independent claim audit pass.

## Session log — batch 4 (published-page audit and structure)
- [x] Rebuilt `funnels/1_individual_self_explorers.html` (published, in sitemap) as a research-only page: removed fabricated testimonial, $149/$49 pricing, Stripe key/checkout script, hardcover/app/dashboard/guarantee claims.
- [x] Hedged "Peer-Reviewed Evidence" heading, "47 peer-reviewed studies" caption, EP-4 "clinically urgent" wording, software-system "Performance & Validation" (now design targets), experiments "Validated Experiments".
- [x] Added `<main>` landmarks to 10 published pages; "See also" sections on 11 research pages; fixed `apgi-experiments.html` duplicate `canvas` declaration that stopped its second script (and a missing `#particle-canvas` element).
- [ ] Open: `app-appendix.html` "Download for macOS" points to github.com/lesoto/apgi-framework releases, which could not be verified from this environment; confirm ownership or remove.

## Session log — batch 5 (accessibility, contrast, print)
- [x] **Bug:** `assets/css/information-pages.css` had a line-wrapped `@import`, which is invalid CSS and corrupted the following `:root` rule, so about/faq/accessibility/cookie-policy rendered unstyled (white, serif). Fixed by putting the `@import` on one line.
- [x] contact form inputs inherited light text on a white field (typed text near-invisible); set an explicit colour. Primary buttons/nav: `#3b82f6` -> `#2563eb` for white-text contrast.
- [x] axe-core (WCAG 2 A/AA + best-practice) over 21 shipped pages: 0 serious violations remain except decorative footer equations (opacity-dimmed, now 0.6). Lightened muted text and purple/pink accents on dark pages; fixed heading order on assessment-v2, experiments, appendix, 404; added unique nav labels; 404 now has `<main>`.
- [x] Print styles now force readable ink on dark-theme pages and show animation-hidden content (verified by rendering PDFs).
- [ ] Open (moderate, best-practice only): "content outside landmarks" for theme toggles/CDN indicator on contact, terms, privacy, experiments, software-system, 404; no manual screen-reader or keyboard-flow test performed; no Lighthouse run.

## Session log — batch 6 (shipped-set containment and link/CSP verification)
- [x] Shipped set audited: 35 HTML pages were reachable in the image, 14 of them unlinked/unsitemapped (ad/Instagram/TikTok templates, a 4.6 MB Plotly export, typo-named duplicates, a quiz with parameter scores, a dashboard on randomly generated sample data, a states visualizer with mechanism claims, the macOS design guide). Added to `.dockerignore`; image now serves 21 HTML pages.
- [x] Shared nav (`assets/js/navigation.js`) and `sitemap.html` linked to excluded pages (Assessment, Book, Solutions -> 404). Assessment now points at `apgi-assessment-v2.html`; Book/Solutions removed; FAQ added.
- [x] Crawl through the real `nginx.conf.template` against an emulated image root: 299 internal href/src references, 46 unique URLs, 0 non-200; 0 `href="#"` placeholders; all 19 `sitemap.xml` URLs served.
- [x] CSP check (production headers, headless Chromium): 0 violations on any shipped page. External hosts actually requested: fonts.googleapis.com, unpkg.com, cdnjs.cloudflare.com.
- [ ] Open: the quarantined files still exist in the repo (excluded, not deleted) pending your keep/delete decision; none was clinically re-audited.

## Session log — batch 7 (unification with main)
- State at start: `main` = `ea3eac1` (unchanged since); working branch 14 commits ahead, 0 behind; PR #4 open into `main`, CI green. Previous merges: #1, #2, #3. All four `Deploy to Cloud Run` runs on `main` failed at "Authenticate to Google Cloud" because `GCP_WORKLOAD_IDENTITY_PROVIDER` reaches the action empty (repository secret not set / not visible to the workflow).
- [x] CI now builds the image, runs the container and runs `scripts/verify_site.py` (security headers on pages/assets/404, held pages 404, every sitemap URL and internal link 200). Passed on the real image in GitHub Actions: 58 URLs, 296 references. Confirmed the script fails against `main`'s old nginx config (all six security headers were missing on every response).
- [x] `deploy.yml`: preflight step fails early with an actionable message when the GCP secrets are missing; deploys serialised via `concurrency`.
- [x] Codex review finding on PR #4 (generated TOC `<nav>` inherited the papers' fixed top-bar `nav` styles): reproduced, fixed (role=navigation div), thread resolved.
- [ ] Needs a human: set repo secrets `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_SERVICE_ACCOUNT` (see top of `deploy.yml`), then merge PR #4 and re-run the deploy; then verify the serving revision, live headers, TLS and DNS.

## Session log — batch 9 (email domain, apex redirect, runbook)
- [x] **Published contact address was on a non-existent domain**: `support@`/`legal@apgi-framework.com` (hyphenated) - `apgi-framework.com` returns NXDOMAIN, so visitor messages would bounce and anyone could register the domain and receive them. Replaced with `info@apgiframework.com` (the mailbox `INFRASTRUCTURE.md` documents as the ops address) in contact.html (x2 visible + 1 fallback) and terms-of-service.html. **Confirm that mailbox receives mail.**
- [x] nginx: apex Host -> 301 to the same path on `https://www.apgiframework.com` (default_server keeps health checks and the `*.run.app` host working). `verify_site.py --apex-redirect` tests it; CI runs it; confirmed it fails against the previous config.
- [x] `DEPLOY_RUNBOOK.md`: GitHub-Actions-primary switch-over, secrets, disabling the Cloud Build trigger, 302 -> 301, apex Cloud Run mapping + A/AAAA, SPF/DMARC.
- [ ] Needs a human: add SPF and DMARC TXT records (none exist); apex mapping or 301; secrets only if switching pipelines.
