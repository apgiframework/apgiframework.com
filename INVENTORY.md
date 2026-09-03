# APGI Inventory & Gap Analysis

## Repo 1 — apgiframework.com (production web frontend)

### Notable fact discovered during the audit, independent of file-by-file disposition

The files described in the original task brief as "untracked" — `APGI-Landing-Page.html`, `Landing-Page.html`, `BOOKING-README.md`, `_ds/`, the 5 `booking-*.html` files, `apgi-software.html`, `apgi_protocol_reference.html`, `how-to-falsify-apgi.html`, `support.js` — are **already committed to `main`** in commit `405bc38` ("minor changes", dated today), which also **deleted `PRODUCT.md`**. That deleted file described a generic Stripe appointment-booking demo ("Quick Book," built with a design tool called "Impeccable") — confirming the booking prototypes were never APGI content and predate today's commit. This means off-brand content has already merged into the branch that would presumably deploy to production, with nothing distinguishing it from real site content in the commit history.

### 1. Web frontend — marketing/landing pages

| path | type | LOC/size | last modified | build status | dependencies | duplicate-of | disposition |
|---|---|---|---|---|---|---|---|
| index.html | HTML | 774 / 36K | 2026-08-15 | builds; linked from sitemap.xml as `/` | Google Fonts, internal CSS/JS | — | SHIP |
| index-apgi.html | HTML | 941 / 40K | 2026-08-15 | builds standalone; declares the *same* canonical URL as index.html | same stack | index.html | ARCHIVE |
| index-polaris.html | HTML | 921 / 40K | 2026-08-15 | builds; same canonical collision | same stack | index.html | ARCHIVE |
| apgi-landing.html | HTML | 811 / 36K | 2026-08-15 | builds; only inbound link is sitemap.xml, not in live nav | — | overlaps index.html narrative purpose but no literal canonical collision | UNDECIDED — is this a paid-traffic landing page distinct from the homepage, or a stale draft? |
| Landing-Page.html | HTML (design-canvas export) | 689 / 72K | 2026-09-02 | **BROKEN** — uses proprietary custom elements (`x-dc`, `x-import`) and loads `support.js`, which requires `window.React`/`window.ReactDOM`, neither of which any page loads. Renders nothing usable. | `_ds/apgi-design-system-.../*`, `support.js` | APGI-Landing-Page.html (31-line diff) | DELETE (or move outside the deployed tree) |
| APGI-Landing-Page.html | same | 688 / 72K | 2026-09-02 | same failure mode | same | Landing-Page.html | DELETE |

### 2. Framework/theory content

| path | LOC/size | last modified | build status | dependencies | disposition |
|---|---|---|---|---|---|
| framework-paper.html | 1073 / 32K | 2026-08-15 | builds; linked from index.html | — | SHIP |
| apgi-signature.html | 591 / 24K | 2026-08-15 | builds; only inbound link is sitemap.html (orphaned from real nav) | CDN Tailwind/Lucide | REWRITE structurally — **also carries CRITICAL claim-discipline findings (public "OCD"/"Psychosis"/"MDD"/"Anxiety" preset simulator exposing gated parameters), see CLAIM_AUDIT.md A-3/D-5. Do not wire into nav until remediated.** |
| apgi_protocol_reference.html | 847 / 44K | 2026-09-02 | builds; **zero inbound links anywhere in the site** | — | REWRITE — add meta description + canonical, link from papers-index.html/nav |
| how-to-falsify-apgi.html | 592 / 36K | 2026-09-02 | builds; well-formed head; **zero inbound links** | — | REWRITE — strong on-brand content, completely orphaned; link from framework-paper.html/papers-index.html |

### 3. Research/papers

| path | LOC/size | last modified | build status | disposition |
|---|---|---|---|---|
| papers-index.html | 1070 / 36K | 2026-08-15 | builds; linked from index.html and sitemap.xml | SHIP |
| liquid-networks-paper.html | 1007 / 32K | 2026-08-15 | builds; in sitemap.xml | SHIP |
| lquid-networks-paper.html | 13 / 4K | 2026-08-15 | confirmed working 0-second redirect shim to liquid-networks-paper.html (typo-recovery only, correctly excluded from sitemap.xml) | SHIP (keep, unlisted) |
| multi-scale-consciousness-paper.html | 1045 / 32K | 2026-08-15 | builds; in sitemap.xml | REWRITE — see CLAIM_AUDIT.md A-6 (PTSD/Depression/Dissociation/Autism tags + "intervention targets" language) |
| epistemic-architecture-paper.html | 1231 / 40K | 2026-08-15 | builds; in sitemap.xml | SHIP — good example of properly hedged thermodynamic framing (see CLAIM_AUDIT.md Category C) |
| apgi-series.html | 16 / 4K | 2026-08-15 | confirmed working redirect shim to papers-index.html | SHIP (keep, unlisted) |

### 4. Book

| path | LOC/size | last modified | build status | disposition |
|---|---|---|---|---|
| book-outline.html | 1061 / 40K | 2026-08-15 | builds; **confirmed broken link** at line 961 — `href="Book-Available-Now.html#bundles"` (mixed-case; real file is lowercase `book-available-now.html`, will 404 on a case-sensitive Linux host) | REWRITE — fix link casing |
| book-available-now.html | 493 / 16K | 2026-08-15 | builds; **broken image** — references `assets/images/APGI-Framework-Diagram.png`, actual file on disk is `2-APGI-Framework-Diagram.png`. Copy says "available now" while several sections say "coming soon." | REWRITE — fix image path, resolve the availability-copy contradiction before shipping |

### 5. Software/product pages

| path | LOC/size | last modified | build status | dependencies | duplicate-of | disposition |
|---|---|---|---|---|---|---|
| apgi-software-system.html | 1374 / 48K | 2026-08-15 | builds; **the one actually linked from index.html's nav**, self-consistent canonical | Google Fonts, unpkg Lucide | apgi-software.html | SHIP structurally — **see CLAIM_AUDIT.md C-1 for an unbacked "scientifically validated" overclaim to fix before launch** |
| apgi-software.html | 779 / 36K | 2026-09-02 | builds; canonical/og:url point to `/software.html`, which **does not exist anywhere in this repo**. Not linked from any nav or sitemap.xml. | Google Fonts, unpkg Lucide | apgi-software-system.html | ARCHIVE — earlier/alternate draft that lost the naming fight; keeping both risks duplicate-content SEO and canonical confusion |
| app-explorer.html | 1160 / 36K | 2026-08-15 | builds; in sitemap.xml, no broken image refs | — | REWRITE — carries "scientifically-validated" overclaims (CLAIM_AUDIT.md C-1) and the "Eight Cognitive Profiles" system, which is a second, inconsistent taxonomy alongside quiz-signature.html's 7 archetypes — flag for product consistency |
| app-appendix.html | 1008 / 28K | 2026-08-15 | builds; in sitemap.xml | REWRITE — TOC label "Clinical applications and psychiatric disorders" for a bibliography section, low severity (CLAIM_AUDIT.md A-9) |
| apgi-experiments.html | 1187 / 36K | 2026-08-15 | builds; in sitemap.xml | REWRITE — "Validated Experiments" / "empirical grounding" overclaim (CLAIM_AUDIT.md C-1) |

### 6. Quiz/assessment

Site-wiring check (grep for every `href="…"` across all HTML): sharp split. **apgi-assessment.html has 13 inbound links** from real content pages (index.html, contact.html, app-appendix.html, apgi-experiments.html, 404.html, book-outline.html, neuromodulatory-cascade.html, consciousness-visualization.html, apgi-software-system.html, plus the index variants). **The other four are each linked from exactly one place: sitemap.html.**

| path | LOC/size | title | inbound links | build status | disposition |
|---|---|---|---|---|---|
| apgi-assessment.html | 3934 / 144K | "APGI Cognitive Processing Assessment" | 13 (fully integrated) | builds; debug leak `window.testCalculations` at line 3889 | **REWRITE, BLOCKED** — structural cleanup (strip debug code) plus CLAIM_AUDIT.md D-1 (raw gated parameters + CI + percentile delivered to every user) and E-1 (fabricated normative database, N=1,247, presented as real) are both CRITICAL and must be fixed before this page may stay live |
| assessment-onepage.html | 2508 / 76K | "APGI Consciousness Parameter Assessment" | 1 (sitemap.html only) | builds | UNDECIDED structurally (is this a condensed variant or an abandoned duplicate?) — **also independently BLOCKED by CLAIM_AUDIT.md D-2/A-5 (raw parameters + "risk of anxiety" language)** regardless of the structural decision |
| quiz-signature.html | 942 / 40K | "APGI Signature Parameters Assessment" | 1 (sitemap.html only) | builds; thin static HTML, script-rendered | **REWRITE, BLOCKED** — pairs conceptually with apgi-signature.html but neither links to the other; **also the source of the 7-profile system with 2 of 7 names carrying direct clinical resonance (CLAIM_AUDIT.md §0, A-1-style) and D-3 (raw parameter delivery)** |
| state-assessment.html | 2402 / 84K | "APGI Psychological State Assessment" | 1 (sitemap.html only) | builds; external Chart dependency | UNDECIDED structurally — **also independently BLOCKED**: delivers results literally named "Anxiety" and "Depression" with clinical mechanism text (CLAIM_AUDIT.md A-4) plus raw parameter exposure (D-4) |
| apgi-signature.html | 591 / 24K | "APGI Signature \| The Coordinate System of Consciousness" | 1 (sitemap.html only) | builds | see row 2 above (framework/theory) — **CRITICAL, BLOCKED** |

These five are **not simply duplicates of one quiz** — by title and content they represent at least 3 distinct concepts (full trait assessment, condensed one-pager, "signature" quiz+explainer pair, separate "state" tool). The real structural problem is that only one of five is reachable from live navigation. The claim-discipline problem is separate and more urgent: **four of the five deliver the K7-gated latent parameter vector directly to users**, and this must be fixed regardless of which variants are kept.

### 7. Funnels

| path | build status | disposition |
|---|---|---|
| funnels.html | builds, launcher hub, not linked from index.html nav | UNDECIDED — public launcher or should it be deindexed like `_internal`? |
| funnels/1_individual_self_explorers.html | builds, in sitemap.xml | SHIP |
| funnels/2_therapists_coaches.html | builds, in sitemap.xml | **REWRITE, BLOCKED — CRITICAL** (CLAIM_AUDIT.md A-2/E-2: fabricated NBCC/APA/NASW accreditation badges, a named but unverifiable "Dr. Sarah Chen, Clinical Psychologist" testimonial, and an unbacked APA-attributed retention statistic) |
| funnels/3_academic_researchers.html | builds, in sitemap.xml | **REWRITE, BLOCKED — CRITICAL** (CLAIM_AUDIT.md E-3: lists Nature Human Behaviour/Psychological Science/etc. as "journals featuring APGI research" while the same page admits "not yet peer-reviewed" a few hundred pixels away) |
| funnels/4_organizational_development.html | builds | REWRITE — thin/generic per TODO.md |
| funnels/5_educational_institutions.html | builds | REWRITE — "Wellness Integration"/"holistic" language (CLAIM_AUDIT.md B-1) plus thin content |
| funnels/6_healthcare_professionals.html | builds | **REWRITE, BLOCKED — CRITICAL, highest single risk in the whole audit** (CLAIM_AUDIT.md A-1/E-4: page is titled "APGI Clinical Integration," claims "Certified for medical practices, clinics, rehabilitation centers, and hospitals," names an unqualified FDA classification, and cites three real journal names — Pain Medicine, Journal of Psychosomatic Research, Psychotherapy and Psychosomatics — as if APGI has been published there) |
| funnels/7_tech_industry_professionals.html | builds | REWRITE — vague technical offer per TODO.md |
| funnels/_internal/\*_journey.html (7 files) | build; internal ad-campaign mockups, correctly blocked in robots.txt | ARCHIVE |
| funnels/_internal/ad-display.html | builds | ARCHIVE |
| funnels/_internal/social-media-ads.html | **BROKEN** — references 7 images under `assets/images/ads/`, none of which exist anywhere in the repo | ARCHIVE |

### 8. Booking prototypes — confirmed off-brand, unrelated to APGI

| path | build status | disposition |
|---|---|---|
| booking-index.html | links to `booking-design-showcase.html`, confirmed does not exist — dead link on the hub page itself | DELETE |
| booking-modern-saas.html | builds standalone | DELETE |
| booking-dark-scientific.html | builds standalone | DELETE |
| booking-warm-approachable.html | builds standalone | DELETE |
| booking-bold-minimalist.html | builds standalone | DELETE |
| BOOKING-README.md | documents a "Quick Book" product that is confirmed unrelated to APGI | DELETE |

None of the 5 HTML files mention APGI, consciousness, or the framework anywhere in visible copy. If a consultation-booking feature is genuinely planned for APGI, it should be rebuilt on-brand rather than reusing this generic demo — **flagged as an open question for the operator, see below.**

### 9. Design assets (`_ds/`) and design-canvas runtime

| path | purpose | disposition |
|---|---|---|
| `_ds/apgi-design-system-febe17b4-.../*` (9 files) | confirmed design-canvas tool export (Pencil/Claude "design" skill artboard format) — only ever referenced by the two broken Landing-Page drafts | DELETE alongside those drafts, unless someone intends to extract this into real static CSS |
| support.js (repo root) | 1911 lines; header literally says "GENERATED from dc-runtime/src/*.ts — do not edit," requires a React runtime nothing else loads | DELETE — not deployable; presence at repo root rather than under `assets/` is itself a smell |

### 10. Legal

| path | LOC/size | build status | disposition |
|---|---|---|---|
| privacy-policy.html | 440 / 16K | builds; linked from index.html and sitemap.xml | SHIP, but confirm policy text matches actual data/export behavior once the API's actual data flows are finalized |
| terms-of-service.html | 619 / 24K | builds; footer contains "Cookie Policy" and "Accessibility" links, both `href="#"` dead placeholder anchors | REWRITE — either build the linked pages or remove the dangling links before launch |

### 11. Utility

| path | LOC/size | build status | disposition |
|---|---|---|---|
| sitemap.html | 304 / 12K | builds; currently the *only* page linking to 4 of the 5 quiz variants | REWRITE — exclude internal/redirect/prototype/blocked pages |
| sitemap.xml | 163 / 8K | lists 31 URLs, several with casing that doesn't match real on-disk filenames (e.g. `APGI-Assessment.html` vs. real `apgi-assessment.html`) — resolves on macOS (case-insensitive FS) but **will 404 on a case-sensitive Linux production host** | REWRITE — launch-blocking, not cosmetic; normalize casing |
| robots.txt | 5 lines | correct — disallows `/funnels/_internal/`, points to sitemap.xml | SHIP |
| 404.html | 573 / 16K | builds; includes recovery links | SHIP |
| contact.html | 517 / 16K | builds; form has no `action=` attribute, JS-driven submission | REWRITE — verify form/env wiring end-to-end before launch |
| favicon.ico / favicon.svg | tiny | present, referenced | SHIP |

### 12. Dead weight / unclear-purpose

| item | notes | disposition |
|---|---|---|
| 32 files in `assets/js/` (analytics, api-services, auth-service, payment-service, recaptcha-helper, security-manager, site-search, webhook-tester, and 24 others) | confirmed via grep across every HTML page: **none are referenced by any `<script src>`**, and none are pulled in by the fallback-loader system either | UNDECIDED (batch) — scaffolding for planned-but-unwired features (auth, payments, search, error monitoring)? Needs a roadmap answer per file-group, not a blanket call. |
| assets/js/enhanced-cdn-fallbacks.js | itself unreferenced, and internally points at 3 files that don't exist in the repo at all | DELETE — abandoned superset of the live `cdn-fallbacks.js` |
| assets/js/*-fallback.js (lucide, chartjs, plotly, react, react-dom, recharts, d3 — 7 files) | confirmed genuinely live, dynamically injected by `cdn-fallbacks.js` | SHIP |
| assets/css/* (10 files, incl. 4238-line tailwind-built.css) | not cross-checked for orphans within the time budget | UNDECIDED — needs the same referenced/unreferenced pass done for JS |
| assets/images/* (9 files) | not fully cross-checked | UNDECIDED |
| .env.security.example, assets/security/security-headers.txt | legitimate deployment reference docs (CSP header template matching the site's real CDN allowlist) | SHIP (keep as deployment reference, not public-facing) |

### Duplicate / conflict pairs — explicit list

1. **index.html / index-apgi.html / index-polaris.html** — identical `<title>` and canonical URL declared by all three. Pick index.html (the only one with real nav wiring); archive the other two.
2. **apgi-software.html / apgi-software-system.html** — overlapping topic, apgi-software.html's canonical points to a nonexistent `/software.html`. Only apgi-software-system.html is in live nav. TODO.md's second rating table has this relationship backwards (it flags apgi-software-system.html as the duplicate; it is in fact the canonical file).
3. **liquid-networks-paper.html / lquid-networks-paper.html** — confirmed working typo-redirect shim, not a real duplicate. TODO.md's second table has an internal data-entry bug here (both rows are typed with the correctly-spelled filename, making it look like the file is being told to rename itself to its own name) — not a real site issue, just a TODO.md authoring error.
4. **Landing-Page.html / APGI-Landing-Page.html** — near-identical, both broken design-canvas drafts, 31-line diff, differ only in nav-logo treatment.
5. **The 5 booking-\*.html files** — deliberate design-alternative variants of one generic non-APGI booking flow, not duplicates of each other by intent, but all 5 duplicative of nothing on-brand and none should ship here.
6. **The 5 quiz/assessment files** — not simple duplicates (3+ distinct concepts by title/content); the real issue is that 4 of 5 are unreachable from live navigation, and (separately) 4 of 5 fail the claim-discipline audit.
7. **TODO.md's two rating tables disagree** on several files beyond #2/#3 above (apgi-landing.html, 404.html, funnels.html) — flagged as UNDECIDED items below rather than silently picking a side.

---

## Repo 2 — apgi-api (`~/Sites/PYTHON/apgi-api`, FastAPI backend)

All 98 `app/*.py` files and every `tests/*.py` file pass `python -m py_compile` with no syntax errors; all 6 `scripts/*.sh` pass `bash -n`.

### Security check on committed environment files

- Currently tracked: only `.env.production.template` (safe placeholder). `.env`, `.env.development`, `.env.production` are gitignored today.
- `.env` **was** committed to history for ~4 commits before being untracked (`f3c25b5` → `0a6ad9d`, "chore: untrack .env — was erroneously committed") and is still recoverable via `git show`/reflog on any clone — history was never scrubbed. Content at that historical commit looks like dev-only placeholder values, not live secrets, but the exposure pattern (never purged from history) is a real finding.
- Current working-tree `.env.production` contains the literal string `CHANGE_ME` 8 times across DATABASE_URL, REDIS_URL, JWT_SECRET_KEY, Celery broker/backend URLs, CORS_ORIGINS, and alert webhook URLs — placeholder only, despite not being named `.template`.
- `web/checkout.html` embeds Stripe's own public documented test key (`pk_test_TYooMQauvdEDq54NiTphI7jx`) — safe, not a real credential.
- **No live secrets found in the current tree.** Residual risk is the unscrubbed git history.

### API core (`app/`)

| path | LOC | build status | disposition |
|---|---|---|---|
| app/main.py | 411 | compiles clean | SHIP |
| app/config.py | 532 | compiles clean, validates prod secrets on startup | SHIP |
| app/celery_app.py | 87 | compiles clean | SHIP |
| app/cli.py | 183 | compiles clean | SHIP |
| app/exceptions.py / exception_handlers.py | 502/313 | compiles clean | SHIP |
| app/dependency_checker.py | 252 | compiles clean | SHIP |
| app/tracing.py | 302 | compiles clean | SHIP |
| package `__init__.py` files (6) | 9–93 each | compiles clean | SHIP |
| app/create_db.py, create_demo_user.py, reset_db.py, alter_alembic.py | 47–124 each | compiles clean | UNDECIDED — one-off DB admin scripts; Dockerfile `COPY app/` wholesale puts them in the prod image. Intended? |

**Routes** (`app/routes/`, 14 modules — auth, users, sessions, templates, state, tasks, export, metrics, health, version, admin, api_keys, payments, webhooks): all 14 SHIP structurally. **Exception: `state.py` carries the audit's single most severe finding** — its 4 live endpoints (`/state`, `/interoception`, `/prediction-errors`, `/somatic-markers`) return the K7-gated latent parameters directly, with no gating logic anywhere in the codebase. See CLAIM_AUDIT.md D-7/D-8. **REWRITE, BLOCKED** for `state.py` specifically; the other 13 route modules are clean.

**Services** (`app/services/`, ~20 modules): SHIP across the board, with one flagged overlap — `app/services/task_executor.py` (750 LOC) vs. `app/services/task_execution/task_executor.py` (361 LOC) — UNDECIDED, which is authoritative?

**Middleware** (`app/middleware/`, 17 modules — full security/auth/rate-limit/CSRF/schema-validation/tracing/metrics stack): SHIP across the board.

**Database/models/tasks**:
| path | LOC | disposition |
|---|---|---|
| app/database/models.py | 766 | SHIP |
| app/database/connection.py | 369 | SHIP |
| app/database/sharded_connection.py | 221 | SHIP (feature-flagged, disabled by default) |
| app/models/schemas.py | 2062 | **REWRITE, BLOCKED** — the response schemas that carry the gated parameters (`PrecisionState`, `IgnitionState`, `SystemStateResponse`, `PredictionErrorsResponse`, `SomaticMarkersResponse`) live here, see CLAIM_AUDIT.md D-7 |
| app/tasks/task_registry.py | 114 | SHIP |
| app/tasks/experimental_tasks.py | 562 | UNDECIDED — intended for prod, or scaffolding? |
| app/tasks/webhook_tasks.py | 35 | SHIP |
| app/tests/api_contract_tests.py | 283 | UNDECIDED — lives inside `app/` rather than `tests/`, unusual placement |

**Migrations** (`app/alembic/`, 18 files): chain traced by hand, resolves to a single head (two branches correctly merged at `b1c2d3e4f5a6_merge_heads.py`). All SHIP.

**Tests** (`tests/`): unit (148 files), integration (8), property (13), security (2), load (2) — all SHIP. `tests/e2e/` has **zero actual test files**, only `conftest.py`/`database_utils.py` — UNDECIDED, scaffolded-but-abandoned or planned? `pyproject.toml` sets `--cov-fail-under=100` — UNDECIDED, confirm this gate is intentional and currently achievable.

**Deployment/infra** (`deployment/`) — **the single largest structural gap relative to the governing plan**:
| path | provisions | disposition |
|---|---|---|
| deployment/Dockerfile, Dockerfile.dev | multi-stage prod + dev images | SHIP |
| deployment/docker-compose.yml, docker-compose.prod.yml | local orchestration | SHIP for local dev; not a GCP artifact |
| deployment/terraform/main.tf | **AWS**: VPC, subnets, IGW, security groups, `aws_db_instance` (RDS), `aws_elasticache_cluster` | **REWRITE — targets AWS; governing plan requires GCP (Cloud Run/Cloud SQL/Cloud Storage/BigQuery/Secret Manager/Cloud Scheduler). None of those GCP services are present anywhere in this file.** |
| deployment/kubernetes/deployment.yaml | placeholder image `your-registry/apgi-api:latest`, no Artifact Registry wiring | ARCHIVE if Cloud Run is adopted (redundant with serverless) |
| deployment/kubernetes/postgres-shards.yaml | self-hosted sharded Postgres StatefulSet | **ARCHIVE — conflicts with managed Cloud SQL target** |
| deployment/kubernetes/redis-cluster.yaml | self-hosted Redis cluster | UNDECIDED — Cloud Run + Memorystore vs. self-hosted, open architecture decision |
| deployment/kubernetes/hpa.yaml, service.yaml | autoscaling/networking | ARCHIVE if Cloud Run is adopted (Cloud Run autoscales natively) |
| .github/workflows/ci.yml | lint/typecheck/security/test/build/docs — **no deploy job** | SHIP as CI; UNDECIDED whether a GCP deploy job should be added |

Both `deployment/terraform/` and `deployment/kubernetes/` were last touched **3.5+ months before** the current `app/` code — this infra scaffold predates and was never aligned to a GCP target.

**Docs** (`docs/`): COMPLIANCE, CONFIGURATION, HANDS-ON, OPERABILITY, REFERENCE, REST-API, RUNBOOKS, TROUBLESHOOTING, Utility-Scripts — all SHIP. `DEPLOYMENT.md` — UNDECIDED, likely references the stale AWS terraform/K8s and needs a rewrite alongside it. **`docs/THEORY.md` — REWRITE, BLOCKED**: states APGI's consciousness constructs as established fact in six separate places rather than as a theoretical/unvalidated model (e.g. "This is the neural signature of consciousness," "APGI is a neuroscientific theory of consciousness" — see CLAIM_AUDIT.md for full quotes).

**Secondary frontend** (`web/`) — a second, separate marketing/product site living inside the API repo:
| path | purpose | wired to backend? | disposition |
|---|---|---|---|
| web/Landing.html | marketing landing page | no — static, no backend route serves it | ARCHIVE — duplicates apgiframework.com's own landing-page drafts; also carries claim-discipline hits (CLAIM_AUDIT.md D-9) |
| web/API.html | static API documentation | no | ARCHIVE in favor of `docs/REST-API.md` or the production site — currently 3 parallel sources of API-doc truth exist |
| web/register.html | registration form | fetches `http://127.0.0.1:8000/...` — hardcoded localhost | REWRITE if intended as real UI, else ARCHIVE |
| web/checkout.html | Stripe checkout UI | fetches hardcoded localhost | REWRITE if intended as real UI, else ARCHIVE |
| web/dashboard.html | internal ops analytics dashboard | **yes** — actually served by `app/routes/metrics.py` at `GET /v1/metrics/dashboard/html` | SHIP — legitimate internal tool, not a duplicate frontend |

**Root-level scripts/config**: `scripts/*.sh`/`.ps1` (6 pairs), `demo_script.py`, `take_flow_screenshots.py`, `delete_pycache.py`, `requirements.txt`, `requirements-dev.txt`, lint/type configs — all SHIP. `Tests_GUI.py`/`Utils_GUI.py` — UNDECIDED, root or a `tools/` dir? **`requirements-prod.txt` — DELETE**: the Dockerfile actually installs from `requirements.txt`, and this file is missing `stripe`/`pyotp`/`cryptography`/`aiohttp` (all in active use) — if anyone ever switches the Dockerfile to use it, the build breaks.

---

## Gap analysis — what apgiframework.com needs to launch

| surface | asset exists? | current state | what's missing |
|---|---|---|---|
| Landing | Yes — index.html | SHIP-ready | Two duplicate-canonical variants and two broken design-canvas drafts need resolving |
| Framework/theory | Yes — framework-paper.html | SHIP-ready | apgi_protocol_reference.html and how-to-falsify-apgi.html are strong content, completely orphaned from navigation |
| Research/papers | Yes — papers-index.html + 4 papers | Mostly SHIP-ready | multi-scale-consciousness-paper.html needs the clinical-tag fix (CLAIM_AUDIT.md A-6) |
| Book | Yes — 2 pages | Both need fixes: broken cross-link, broken image, contradictory "available now"/"coming soon" copy | QA pass before "available now" claims go live |
| Software | Yes — apgi-software-system.html | Structurally SHIP-ready | Duplicate apgi-software.html should be archived; "scientifically validated" overclaim needs fixing (CLAIM_AUDIT.md C-1) |
| Quiz | Yes — 5 variants, only 1 live | **Blocked** — 4 of 5 deliver K7-gated parameters and/or clinical-named results directly to users; apgi-assessment.html additionally fabricates a normative database | Full claim-discipline remediation required before any quiz variant beyond the current one may ship; see CLAIM_AUDIT.md |
| API docs | **No page in this repo.** A `docs/REST-API.md` exists in apgi-api, and a duplicate `web/API.html` also exists there — neither is exposed on apgiframework.com/api docs URL. | — | Needs a single canonical API-docs surface, ideally auto-generated from FastAPI's OpenAPI schema |
| About | **No.** No file matching "about" exists anywhere in the repo. | — | Does not exist at all |
| Legal — Privacy Policy | Yes | SHIP-ready | Confirm text matches actual data/export behavior once finalized |
| Legal — Terms of Service | Yes | Two dead placeholder links (Cookie Policy, Accessibility) | — |
| Legal — Cookie Policy | **No.** Only a dead `#` link exists. | — | Needs to be built from scratch — becomes a compliance requirement the moment `analytics.js` (currently dead/unwired) is ever activated |
| Legal — Accessibility Statement | **No.** Same dead-link pattern. | — | Doesn't exist |

---

## Full UNDECIDED list — every open question needing a human answer

1. **apgi-landing.html** — standalone landing page or retire? Not in live nav, no literal duplicate signal against index.html despite TODO.md's second table calling it one.
2. **assessment-onepage.html, quiz-signature.html, state-assessment.html, apgi-signature.html** — which (if any) launch alongside apgi-assessment.html once claim-discipline issues are fixed, and which are abandoned experiments? Needs a per-file product decision.
3. **32 unreferenced files in assets/js/** — dead code, or scaffolding for a near-term roadmap (auth, payments, search, error monitoring, recaptcha)? If the booking feature is ever rebuilt on-brand, some may be intended for it.
4. **funnels.html** — public launcher or should it be treated like `_internal` and deindexed? Not in index.html's live nav despite being in sitemap.xml.
5. **404.html rendering** — static content looks complete (573 lines, recovery links), but TODO.md's second rating table calls it "no content." Worth a visual/browser check in case of a CSS/JS rendering bug not visible from the static HTML.
6. **assets/css/* orphan check** — not completed within this audit's time budget; the JS orphan-file discovery suggests the same pass is worth doing for CSS (10 files, incl. a 4238-line tailwind-built.css).
7. **Is a booking/scheduling feature actually on the APGI roadmap?** If yes, ARCHIVE (not DELETE) the booking prototypes with a rebuild note. If no, DELETE stands.
8. **apgi-api: `app/create_db.py` / `create_demo_user.py` / `reset_db.py` / `alter_alembic.py`** — intended to ship inside the production image (Dockerfile copies `app/` wholesale) or dev-only?
9. **apgi-api: `task_executor.py` vs `task_execution/task_executor.py`** — which is authoritative? Possible dead duplicate.
10. **apgi-api: `experimental_tasks.py`** — production-bound or scaffolding that should be flagged/renamed?
11. **apgi-api: `tests/e2e/`** — planned-but-unwritten, or an abandoned scaffold?
12. **apgi-api: `pyproject.toml`'s `--cov-fail-under=100`** — intentional and currently passing, or aspirational and currently broken?
13. **apgi-api: `deployment/kubernetes/redis-cluster.yaml`** — Cloud Run + Memorystore, or a genuine intent to self-host Redis in a cluster? Architecture decision needed before Phase 3 of the deploy plan.
14. **apgi-api: `docs/DEPLOYMENT.md`** — does it reference the stale AWS terraform/K8s? Needs a rewrite pass alongside the infra rewrite either way.
