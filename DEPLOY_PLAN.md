# APGI Deployment Plan

---

## 4. Target architecture

### 4.1 Repo structure

**Recommendation: keep two repos, not one monorepo — apgiframework.com (frontend) and apgi-api (backend/API), exactly as already scoped for this audit.**

Argument: the governing plan's own service-boundary design (§6.1) treats "the existing APGI API" as something to containerize and deploy *without rewriting its model logic* — i.e., it already assumes the API is a separate, independently deployable unit. apgi-api is already a mature, independently-versioned FastAPI project with its own CI, its own test suite (176 test files), its own migration history, and its own release cadence via Docker images. Folding it into a monorepo with the marketing site would force the two to share a CI pipeline, a version history, and a deploy cadence they don't actually share — the frontend changes far more often (copy, design, new pages) than the API's data model and auth logic should. A monorepo also makes the git-identity separation the operator asked for (apgiframework for this work) harder to reason about against the personal-namespace history already in each repo.

Keep them separate, but tighten the seam:
- `apgiframework.com` — static/JAMstack frontend, deploys to Cloud Run (see §4.4) or Cloud Storage+CDN, consumes `apgi-api` only over its public REST contract.
- `apgi-api` — the modular monolith described below (`apgi-core`, plus `apgi-jobs` and `apgi-export`), deploys to Cloud Run + Cloud Run Jobs.
- Retire (don't merge) `apgi-api/web/` — it's a second, unwired, localhost-hardcoded frontend duplicating the real site (INVENTORY.md §"Secondary frontend"). Its one live piece, `dashboard.html`, stays as an internal ops page served by `app/routes/metrics.py`; the rest (`Landing.html`, `API.html`, `register.html`, `checkout.html`) should be archived, not migrated.
- A future third repo boundary is worth pre-drawing but not building yet: `apgi-export` (research-export service) should live as an isolated module inside `apgi-api` from day one per the governing doc's own instruction (§6.1: "isolated from day one because its access pattern and its audit requirements differ from everything else"), and can be split into its own deploy unit later without disturbing the frontend.

### 4.2 Service topology

Per the governing plan's explicit instruction (§6.1): **"Deploy three services, not eight."** Eight microservices is called out as "the correct target architecture and the wrong starting point for one developer." This plan follows that guidance exactly:

1. **`apgi-core`** — a modular monolith containing identity/consent, assessment, scoring, norms, longitudinal, and reporting as internal modules with enforced boundaries. This is what `apgi-api`'s existing `app/routes/` + `app/services/` structure already substantially is (auth, sessions, templates, state, tasks, export, metrics — see INVENTORY.md). It needs the K7-gate (§Phase 0) added, not a rewrite.
2. **`apgi-jobs`** — Cloud Run Jobs for feature extraction, norm refresh, scheduled longitudinal computation. Maps onto `apgi-api`'s existing Celery task infrastructure (`app/tasks/`, `app/celery_app.py`); the deployment target changes (Celery worker on Cloud Run vs. self-hosted), the task code mostly doesn't.
3. **`apgi-export`** — research-export service, isolated from day one, wrapping `app/routes/export.py` + `app/services/data_export.py` with its own IAM boundary and audit logging (§4.5).

Explicitly **not** doing yet: separate `identity-consent-service`, `norms-service`, `longitudinal-service`, `report-service`, `admin-service` as independent deployables — these stay as internal modules inside `apgi-core` per the governing doc, with the module boundaries already roughly drawn by `apgi-api`'s existing route/service split. Split along those seams later if load or team size justifies it.

### 4.3 URL and routing map

| URL | Serves | Notes |
|---|---|---|
| `apgiframework.com` | apgiframework.com repo, static frontend | index.html as canonical homepage once index-apgi.html/index-polaris.html are archived (INVENTORY.md §1) |
| `apgiframework.com/papers`, `/framework-paper.html`, etc. | existing content pages | keep current flat structure; a `/papers/*` path restructure is optional polish, not required for launch |
| `apgiframework.com/assessment` (or similar) | apgi-assessment.html, **once Phase 0 remediation is complete** | do not point a clean URL at any of the 4 currently-blocked quiz variants until CLAIM_AUDIT.md D-1–D-4 are fixed |
| `apgiframework.com/privacy`, `/terms` | privacy-policy.html, terms-of-service.html | add `/cookies` and `/accessibility` — currently dead-linked (INVENTORY.md §10), pages don't exist |
| `apgiframework.com/about` | **does not exist yet** | gap identified in INVENTORY.md — needs to be built |
| `apgiframework.com/api-docs` (or `/developers`) | **does not exist yet** — should proxy/embed apgi-api's auto-generated OpenAPI docs (`/docs` on the API itself) rather than maintaining a third parallel copy (INVENTORY.md flags 3 competing API-doc sources: `apgi_protocol_reference.html`, `apgi-api/docs/REST-API.md`, `apgi-api/web/API.html`) | consolidate to one source of truth, ideally generated |
| `api.apgiframework.com` | apgi-api, Cloud Run service | private by default per governing doc §9.3 step 2 ("Deploy the API as a **private** Cloud Run service"); only the specific public endpoints the frontend needs go through a public path |
| `api.apgiframework.com/v1/*` | apgi-core routes | per the governing doc's core API contract (§6.2): `/v1/sessions`, `/v1/participants/{id}/profile`, `/v1/participants/{id}/norms`, `/v1/experiments`, `/v1/reports/{id}`, `/v1/participants/{id}/consent`, `/v1/participants/{id}` (DELETE, cascading erasure), `/v1/participants/{id}/export`, `/v1/reference-datasets/{version}/card`, `/v1/instrument/psychometrics` |
| `api.apgiframework.com/v1/sessions/{id}/state`, `/interoception`, `/prediction-errors`, `/somatic-markers` | apgi-core, `app/routes/state.py` | **must not return gated fields until K7 passes — see Phase 0**; these four endpoints exist today and currently do return them |
| `api.apgiframework.com/docs` | FastAPI auto-generated OpenAPI/Swagger UI | already exists in apgi-api (`app/main.py`); can be the single source of truth for API docs instead of the 3 currently-duplicated copies |

### 4.4 Static vs SSR vs container decisions

- **apgiframework.com → static, served from Cloud Run (containerized) or Cloud Storage + Cloud CDN.** The site is plain HTML/CSS/JS with no server-side rendering need (confirmed by INVENTORY.md — every page is a standalone `.html` file with client-side JS). Cloud Storage + CDN is cheaper and simpler for pure static content; Cloud Run is preferable only if the site later needs server-side logic (e.g., a real contact-form backend, server-side A/B testing) or if keeping deployment mechanics identical across both apgiframework.com and apgi-api is valued for operational simplicity. **Recommendation: Cloud Storage + Cloud CDN + Cloud Load Balancing for the static site**, reserving Cloud Run for apgi-api where it's actually needed (stateful auth, DB connections, background jobs).
- **apgi-api → container on Cloud Run**, exactly as the governing doc specifies (§9). Already has a working multi-stage Dockerfile (INVENTORY.md: `deployment/Dockerfile`, SHIP). This is a genuine "containerise the current API without rewriting its model logic" per the governing doc's own deployment sequence step 1.
- **apgi-jobs → Cloud Run Jobs**, replacing the currently-provisioned self-hosted Celery worker model. The existing Celery task code (`app/tasks/`) doesn't need to be rewritten; the execution environment does (see Phase 7).

### 4.5 Env/secret inventory

Every secret below belongs in **Secret Manager**, never in the repo. Current state per INVENTORY.md: no live secrets found in either repo's working tree; apgi-api's `.env` was committed to git history for ~4 commits before being untracked and was never scrubbed (low urgency given placeholder content, but a `git filter-repo`/BFG pass is recommended before this repo is ever made more widely accessible).

| Secret | Current location | Target |
|---|---|---|
| `DATABASE_URL` (Cloud SQL Postgres connection string) | `.env`/`.env.production` (placeholder `CHANGE_ME` today) | Secret Manager, injected via Cloud Run service account |
| `REDIS_URL` (or Memorystore equivalent) | same | Secret Manager |
| `JWT_SECRET_KEY` (≥32 chars, validated on startup per `app/config.py`) | same | Secret Manager |
| `CURSOR_SIGNING_KEY` (≥32 chars) | same | Secret Manager |
| `CELERY_BROKER_URL` / `CELERY_RESULT_BACKEND` | same | Secret Manager |
| Stripe live secret key + webhook signing secret | not found in current tree (only a public test key in `web/checkout.html`, safe) | Secret Manager — must be added when payments go live |
| SMTP credentials | `.env` (placeholder) | Secret Manager |
| `CORS_ORIGINS` | env var, not strictly secret but environment-specific | Secret Manager or Cloud Run env config |
| Alert webhook URLs | `.env.production` (placeholder) | Secret Manager |
| Audit-log signing key (per governing doc §9.2.1 — "every score generation writes an append-only record... signed with a key held in Secret Manager") | **does not exist yet** — not implemented anywhere in apgi-api | must be created as part of Phase 7; this is the governing doc's own top recommendation: "the cheapest of the seven controls and the highest-leverage" |
| reCAPTCHA secret (TODO.md lists reCAPTCHA verification as unimplemented) | not found | Secret Manager, once implemented |

### 4.6 Staging environment design

**Separate GCP project, not a separate bucket or a separate Cloud Run revision tag** — this is the governing doc's own explicit instruction (§9.2: "Separate GCP projects for production and research, not merely separate buckets — a project boundary is the only access boundary that survives a misconfigured IAM binding"), and it applies equally to prod-vs-staging as it does to prod-vs-research.

- **Production project**: `apgi-web` (existing, confirmed by operator).
- **Staging project**: a new project, e.g. `apgi-web-staging` — **HUMAN ACTION REQUIRED** (creating a new GCP project and linking it to billing is an operator action, not something to script unattended).
- Staging gets its own Cloud SQL instance (smallest tier), its own Cloud Run services, its own Secret Manager secrets (never shared values with prod), and its own subdomain (e.g. `staging.apgiframework.com`, `staging-api.apgiframework.com`).
- The governing doc's tested-deletion-job requirement (§9.2.1: "Run it against a seeded test participant in staging on every deploy, and assert zero residual rows") depends on staging existing as a real, isolated project — this is not optional polish, it's the only place that job can safely run repeatedly.

---

## 5. Deployment plan

Sequence, per the task brief and cross-checked against the governing doc's own step 9.3 sequence: **claim-discipline remediation → repo reorganisation → local build green → staging deploy → DNS and TLS → production deploy → monitoring → data-layer services.** Every phase is independently revertible. Steps requiring the operator are marked **HUMAN ACTION REQUIRED** and will not be attempted by an agent.

### Phase 0 — Claim-discipline remediation (BLOCKING)

**Goal:** bring all 9 Critical-finding files (CLAIM_AUDIT.md) into compliance before any further phase proceeds.

**Preconditions:** CLAIM_AUDIT.md reviewed and approved by the operator; a decision made on each suggested replacement (accept as written, modify, or override with a documented reason).

**Ordered actions** (content edits, not infra — no gcloud/terraform commands in this phase):
1. `apgi-api/app/routes/state.py` + `app/models/schemas.py`: add a K7-gate check (feature flag keyed to per-parameter identifiability status, per governing doc §3.6 — "Enforce this in the scoring service with an allow-list of exposable fields... A field absent from the allow-list raises rather than returning null") in front of `/state`, `/interoception`, `/prediction-errors`, `/somatic-markers`. Until K7 passes for a given parameter, that field must be absent from the response, not null and not present-with-a-caveat.
2. `funnels/6_healthcare_professionals.html`: remove the FDA classification claim and fabricated journal citations (CLAIM_AUDIT.md A-1/E-4). Recommend not republishing this funnel until real legal review — see Phase 0 human-action items below.
3. `funnels/2_therapists_coaches.html`: remove fabricated NBCC/APA/NASW badges and the unverifiable testimonial (A-2/E-2).
4. `funnels/3_academic_researchers.html`: remove the self-contradicting journal-publication claims (E-3).
5. `apgi-assessment.html`, `assessment-onepage.html`, `quiz-signature.html`, `state-assessment.html`: strip raw parameter/percentile display per D-1–D-4/E-1; `apgi-signature.html`: rename clinical presets per A-3/D-5.
6. `docs/THEORY.md` (apgi-api): add hedging language to the six lines identified in the original claim-audit research (asserting APGI as established fact rather than a theoretical model).
7. Re-run a scoped verification pass (grep for the same term list used in CLAIM_AUDIT.md) across all 9 files to confirm no residual hits before Phase 1 begins.

**Verification test:** re-run the same grep/read pass CLAIM_AUDIT.md used, against the same 9 files. **Pass** = zero Critical or High findings remain; Medium/Low findings may be tracked as follow-up work, not blockers. **Fail** = any Critical finding remains → do not proceed to Phase 1.

**Rollback:** pure content/code edits in git; revert via normal `git revert` if a change breaks something. No infra exists yet to roll back.

**Estimated time:** 3–5 days of focused editing + one legal/regulatory review pass on the healthcare and therapist funnel pages (see human-action item below).

**Blast radius:** none — this phase touches only repo content, not live infrastructure.

**HUMAN ACTION REQUIRED:** legal/regulatory review of `funnels/6_healthcare_professionals.html` and `funnels/2_therapists_coaches.html` before either is republished in any form — the FDA-classification and accreditation-badge claims are not something to rewrite unilaterally without counsel sign-off, given the medical-device reclassification risk the governing doc itself flags (§7.5).

---

### Phase 1 — Repo reorganisation

**Goal:** align each repo's structure with the target architecture in §4 without changing deployment behavior yet.

**Preconditions:** Phase 0 complete and verified.

**Ordered actions:**
1. In `apgiframework.com`: resolve the duplicate/archive list from INVENTORY.md §1/§5/§8/§9 — archive `index-apgi.html`, `index-polaris.html`, `apgi-software.html`; delete `Landing-Page.html`, `APGI-Landing-Page.html`, `_ds/`, `support.js`, and the entire booking-prototype cluster (6 files) pending the operator's answer to INVENTORY.md open question #7 (is booking a real roadmap item?).
2. Fix the two launch-blocking structural bugs identified: `sitemap.xml` casing mismatches (INVENTORY.md §11 — will 404 on case-sensitive Linux hosting) and `book-outline.html`'s mixed-case broken link.
3. In `apgi-api`: archive `web/Landing.html` and `web/API.html`; decide (per INVENTORY.md open questions #8–10) on `create_db.py`/`create_demo_user.py`/`reset_db.py`/`alter_alembic.py` staying in the prod image, the `task_executor.py` duplicate, and `experimental_tasks.py`'s naming. Delete `requirements-prod.txt` (confirmed stale/unused, would break a build if ever switched to).
4. Rewrite `deployment/terraform/main.tf` for GCP (see Phase 3) — this is deferred to Phase 3 rather than done here, since it's infra-as-code that should be written and reviewed together with the staging deploy it targets.

**Verification test:** `git status` clean, no orphaned references (`grep -r` for any deleted filename returns zero hits in the surviving codebase), site still builds locally (see Phase 2).

**Rollback:** `git revert` the reorganisation commit(s); nothing external depends on the old structure yet.

**Estimated time:** 1–2 days.

**Blast radius:** none — no live traffic yet.

---

### Phase 2 — Local build green

**Goal:** confirm both repos run cleanly end-to-end locally after reorganisation, before any cloud resource is touched.

**Preconditions:** Phase 1 complete.

**Ordered actions:**
```bash
# apgi-api
cd ~/Sites/PYTHON/apgi-api
pip install -r requirements-dev.txt
./scripts/start.sh                          # brings up Postgres, Redis, API, Celery via Docker Compose
pytest tests/unit/ tests/integration/        # full suite short of load/e2e
alembic upgrade head                         # confirm migration chain resolves to a single head with no conflicts

# apgiframework.com
cd ~/Sites/PRODUCTION/apgiframework.com
python3 -m http.server 8080                  # or any static server; the site has no build step today
# open http://localhost:8080/index.html and click through the surviving nav
```

**Verification test:** `pytest` exits 0 with no new failures beyond the known `tests/e2e/` gap (INVENTORY.md — zero test files there today, not a regression); `alembic upgrade head` completes without error; every link reachable from `index.html`'s nav resolves to a 200, not a 404.

**Rollback:** N/A — local only.

**Estimated time:** half a day.

**Blast radius:** none.

---

### Phase 3 — Staging deploy

**Goal:** first real cloud deployment, in an isolated GCP project, of both `apgi-core` (containerized apgi-api) and the static frontend.

**Preconditions:** Phase 2 green. Staging GCP project exists (see below, human action).

**HUMAN ACTION REQUIRED (before this phase can start):**
- Create the staging GCP project (e.g. `apgi-web-staging`) and link it to billing.
- Grant the deploying identity (`apgiframework` service account or the operator's own account) the IAM roles needed: Cloud Run Admin, Cloud SQL Admin, Secret Manager Admin, Storage Admin, Artifact Registry Admin on the staging project only.
- Confirm a budget alert is configured on the staging project (governing doc §9.4 estimates staging costs should track close to the low end of the production estimate in §6 below).

**Ordered actions (once the above is granted):**
```bash
# Rewrite deployment/terraform for GCP — this replaces the AWS-targeted main.tf found in INVENTORY.md
cd ~/Sites/PYTHON/apgi-api/deployment/terraform
# (new GCP terraform: Cloud Run service, Cloud SQL Postgres instance, VPC connector,
#  Secret Manager secrets, Artifact Registry repo — targeting the staging project)
terraform init
terraform plan -var="project_id=apgi-web-staging" -var="env=staging"
# operator reviews the plan diff before apply — HUMAN ACTION REQUIRED
terraform apply -var="project_id=apgi-web-staging" -var="env=staging"

# Build and push the API container
gcloud builds submit --project apgi-web-staging --tag \
  us-central1-docker.pkg.dev/apgi-web-staging/apgi-core/api:staging-$(git rev-parse --short HEAD)

# Deploy to Cloud Run (private service, per governing doc §9.3 step 2)
gcloud run deploy apgi-core-staging \
  --project apgi-web-staging \
  --image us-central1-docker.pkg.dev/apgi-web-staging/apgi-core/api:staging-$(git rev-parse --short HEAD) \
  --no-allow-unauthenticated \
  --add-cloudsql-instances apgi-web-staging:us-central1:apgi-core-staging-db \
  --set-secrets DATABASE_URL=database-url:latest,JWT_SECRET_KEY=jwt-secret:latest,CURSOR_SIGNING_KEY=cursor-signing-key:latest

# Run migrations against the staging DB
gcloud run jobs execute apgi-migrate-staging --project apgi-web-staging

# Deploy the static frontend to Cloud Storage + CDN
gsutil mb -p apgi-web-staging -l us-central1 gs://apgi-frontend-staging
gsutil -m rsync -r ~/Sites/PRODUCTION/apgiframework.com gs://apgi-frontend-staging \
  -x '\.git/|_ds/|node_modules/'
```

**Verification test:** health check passes (`GET /health` on the private Cloud Run service, called via an authenticated `gcloud run services proxy` tunnel or a temporary IAM binding for the tester); `alembic upgrade head` confirms the migration chain applied cleanly against a fresh Cloud SQL instance; the deletion job (governing doc §9.2.1) runs once against a seeded test participant and asserts zero residual rows. **Pass** = all three green. **Fail** = any error → do not proceed to Phase 4, roll back per below.

**Rollback:** `gcloud run services update-traffic apgi-core-staging --to-revisions=PREVIOUS=100` to the last-good revision; `terraform destroy -target=<failed resource>` for infra-level failures; the staging Cloud SQL instance's automated backup (see Phase 6) provides a restore point if migrations corrupt data.

**Estimated time:** 2–3 days including the terraform rewrite (this is genuinely new work — the existing AWS terraform in `apgi-api` cannot be adapted, it needs to be rewritten for GCP resources).

**Blast radius:** staging only — a separate GCP project boundary means a misconfiguration here cannot reach production data or DNS.

---

### Phase 4 — DNS and TLS

**Goal:** point `apgiframework.com` and `api.apgiframework.com` at the (eventually production) infrastructure, with valid TLS.

**Preconditions:** Phase 3 staging deploy verified; production infra provisioned (this phase can run in parallel with the *tail end* of Phase 3/start of Phase 5, but DNS propagation lag means it should be started early).

**HUMAN ACTION REQUIRED (entire phase):**
- Confirm domain registrar and current DNS provider for `apgiframework.com` — **not established in this audit; the operator must confirm who currently controls the domain's nameservers** before any record changes are proposed.
- Add/modify DNS records: `A`/`CNAME` for `apgiframework.com` → Cloud Load Balancer or Cloud Storage/CDN endpoint; `CNAME` for `api.apgiframework.com` → the Cloud Run service's mapped domain.
- Provision a Google-managed TLS certificate via Cloud Load Balancing (`gcloud compute ssl-certificates create`) or use Cloud Run's automatic domain-mapping TLS (`gcloud run domain-mappings create`) — either works, the latter is simpler for a single Cloud Run service.
- **This step cannot be scripted end-to-end by an agent** — it requires registrar/DNS-provider console access the operator holds, not anything discoverable in either repo.

**Verification test:** `dig apgiframework.com` and `dig api.apgiframework.com` resolve to the expected targets from multiple resolvers (propagation can take up to 48 hours, plan for it); `curl -I https://apgiframework.com` and `curl -I https://api.apgiframework.com/health` return valid TLS handshakes with no certificate warnings.

**Rollback:** revert the DNS record change at the registrar; TLS certs auto-renew/reprovision once records point correctly again, no separate rollback needed for the cert itself.

**Estimated time:** 1 day of configuration + up to 48 hours of propagation buffer before treating this phase as "done."

**Blast radius:** if done against production DNS before Phase 5 is ready, this could point the live domain at an incomplete deployment — **sequence Phase 4's actual cutover after Phase 5's verification, even though the certificate/record prep can start earlier.**

---

### Phase 5 — Production deploy

**Goal:** deploy the verified staging build to the production GCP project (`apgi-web`).

**Preconditions:** Phase 3 verification passed; Phase 0 remediation confirmed still intact (re-run the Phase 0 verification grep once more immediately before this phase — regressions between staging and prod deploy are the most common way a "fixed" claim-discipline issue silently reappears).

**HUMAN ACTION REQUIRED (before this phase):**
- Confirm billing is enabled on `apgi-web` (governing doc's cost estimate in §6 below assumes it already is, per the operator's confirmation that this is a pre-existing project).
- Grant the deploying identity production IAM roles — narrower than staging (governing doc §9.2.1: "Named humans appear only in break-glass roles with logged, time-bound elevation").
- Sign off on the go-live decision itself — this is a judgment call, not something an agent should trigger unattended.

**Ordered actions:** mirror Phase 3's commands with `--project apgi-web` and `--env production` in place of staging, using the terraform module already reviewed and applied in staging (same module, different `tfvars`). Frontend: `gsutil -m rsync` to the production bucket instead of the staging one.

**Verification test:** same three checks as Phase 3 (health check, migration chain, deletion-job dry run), plus a manual click-through of the live site's surviving nav (the same list verified in Phase 2, now against the real domain once Phase 4's cutover completes).

**Rollback:** `gcloud run services update-traffic apgi-core --to-revisions=PREVIOUS=100`; frontend rollback via `gsutil` re-sync from the last-good git tag; database rollback per the tested backup/restore procedure established in Phase 6 (governing doc §9.2.1: "An untested backup is not a backup" — this must exist *before*, not after, first production deploy).

**Estimated time:** half a day, assuming Phase 3's terraform module needed no changes beyond project/env variables.

**Blast radius:** production — this is the first phase with real user-facing blast radius. Everything upstream (Phase 0–4) exists specifically to shrink what can go wrong here.

---

### Phase 6 — Monitoring

**Goal:** operational visibility before real traffic arrives, not after.

**Preconditions:** Phase 5 complete.

**Ordered actions:**
```bash
# Cloud Monitoring uptime checks
gcloud monitoring uptime create apgi-frontend-uptime --resource-type=uptime-url \
  --host=apgiframework.com --path=/ --project apgi-web
gcloud monitoring uptime create apgi-api-uptime --resource-type=uptime-url \
  --host=api.apgiframework.com --path=/health --project apgi-web

# Alert policies on error rate, latency, Cloud SQL CPU/storage
gcloud alpha monitoring policies create --project apgi-web --policy-from-file=monitoring/error-rate-policy.yaml
gcloud alpha monitoring policies create --project apgi-web --policy-from-file=monitoring/cloud-sql-policy.yaml

# Point-in-time recovery on Cloud SQL (governing doc §9.2.1 explicit requirement)
gcloud sql instances patch apgi-core-db --project apgi-web --enable-point-in-time-recovery

# Backup/restore drill — run once now, then quarterly per governing doc §9.2.1
gcloud sql backups create --instance=apgi-core-db --project apgi-web
# (restore to a scratch instance and time it — this is the drill, not just the backup)
```

**Verification test:** a synthetic failure (e.g., temporarily scale the Cloud Run service to 0) triggers the configured alert within its expected latency; the backup restore drill completes and is timed; **pass** = alert fires and restore succeeds within a documented time budget.

**Rollback:** N/A — monitoring config is additive and low-risk; a bad alert policy is edited/deleted directly.

**Estimated time:** 1–2 days, plus the quarterly-recurring restore drill going forward.

**Blast radius:** low — monitoring changes don't touch the serving path, except the deliberate synthetic-failure test, which should be run against staging first if there's any doubt about its blast radius.

---

### Phase 7 — Data-layer services

**Goal:** stand up the parts of the governing plan that go beyond "the site is up" — the audit-log signing chain, the norms/reference-dataset pipeline, and the Cloud Run Jobs replacing self-hosted Celery.

**Preconditions:** Phases 0–6 complete and stable in production for at least one full deploy cycle.

**Ordered actions:**
1. Implement the signed audit log for scoring/report access (governing doc §9.2.1 — "the cheapest of the seven controls and the highest-leverage," not yet implemented anywhere in `apgi-api`). Signing key lives in Secret Manager (§4.5).
2. Migrate Celery workers from self-hosted (current `docker-compose`/K8s model) to Cloud Run Jobs, per §4.1/§4.4. This is the `apgi-jobs` deploy unit.
3. Stand up BigQuery for the de-identified analytics/normative dataset, per governing doc §9.2 data-separation model (identified operational data in Cloud SQL only; pseudonymised research data in restricted Cloud Storage; de-identified features exported to BigQuery — never the reverse).
4. Implement the `cohort_type`-required norms service (governing doc §5: "requires an explicit `cohort_type` argument on every percentile computation and raises on a null or mixed value") — this directly replaces the fabricated `NORMATIVE_DATA` object flagged in CLAIM_AUDIT.md E-1 with a real, versioned pipeline.
5. Implement the tested cascading-deletion job across Cloud SQL, Cloud Storage, and BigQuery (governing doc §7.4/§9.2.1) — run it against a seeded test participant on every deploy, in staging, before it's trusted in production.
6. Cloud Scheduler jobs for monthly re-scoring, retest-reminder emails, norm refreshes (governing doc §9.1/§9.3 step 9).

**HUMAN ACTION REQUIRED:**
- OSF pre-registration (governing doc §0.1) — must be published before any pilot recruitment, and its URL published on the assessment landing page. This is a scientific/administrative action, not an infra one.
- Privacy lawyer review of the item bank (governing doc §7.2) — required before this phase's data collection goes live, given the Article 9 special-category-data exposure of interoceptive/mood items.
- IRB approval — commercial IRB, university affiliation, or professional-association ethics committee (governing doc §7.3); attach the approval number to the OSF registration. **Do this during the pilot phase, not later** — the governing doc is explicit that discovering the lack of it after n=3,000 is "a catastrophe with no remedy."
- Data-residency decision for EU participants (governing doc §7.2 — "EU participants in EU regions"): a concrete GCP region choice, not something to default silently.
- Decision on whether research consent is irrevocable for already-published aggregate results (governing doc §7.4) — must be decided and stated in the consent text, not assumed.

**Verification test:** the deletion job, run against a seeded participant, leaves zero residual rows across all three stores (Cloud SQL, Cloud Storage, BigQuery), including partitioned tables and any materialized norm views — verified by direct query, not just job-success status.

**Rollback:** each sub-component (audit log, Cloud Run Jobs migration, BigQuery pipeline, norms service, deletion job, Cloud Scheduler) is independently deployable and revertible; none of them touch the already-stable Phase 5 serving path.

**Estimated time:** this phase is the largest — realistically weeks, not days, and maps onto the governing doc's own "Months 3" (pilot) through "Months 7–9" (reference dataset) timeline, not a single sprint.

**Blast radius:** the deletion-job and audit-log pieces carry real legal/compliance weight if wrong — test thoroughly in staging (per the repeated-drill requirement above) before trusting either in production.

---

## 6. Risks and costs

### Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Claim-discipline regressions reappear between staging and production deploy | Medium | Critical | Re-run the Phase 0 verification grep immediately before Phase 5, not just once at the start |
| Live API continues returning K7-gated parameters after a rushed deploy | Medium | Critical | The gate is a code-level allow-list (governing doc §3.6), not a UI-layer hide — verify via a direct authenticated API call in Phase 3/5 verification, not just by checking the frontend doesn't display it |
| DNS propagation delay stalls the production cutover | Medium | Low | Start Phase 4's record/cert prep early, treat the 48-hour buffer as expected, not a failure |
| TLS provisioning delay | Low | Medium | Use Cloud Run's managed domain-mapping TLS (simpler, faster provisioning) over a manual Load Balancer cert unless multi-service routing is needed |
| Cloud SQL cost overrun | Low | Medium | Start with the smallest HA-eligible tier (governing doc §9.4 estimate: $50–120/mo); set a budget alert on both GCP projects at Phase 3 |
| Cold-start latency on Cloud Run | Medium | Low | Set a small non-zero minimum instance count on the API service once real traffic arrives; acceptable to scale-to-zero during the staging/low-traffic period |
| Secret misconfiguration (a placeholder `CHANGE_ME` value reaching production) | Medium | Critical | `app/config.py` already raises `ValueError` in production if `JWT_SECRET_KEY`/`CURSOR_SIGNING_KEY`/`DATABASE_URL`/`REDIS_URL` are missing or insecure — confirmed working; extend the same startup validation pattern to any new production secrets added in Phase 7 |
| Accidental exposure of the research data path | Low | Critical | Governing doc's data-separation model (§9.2) — separate GCP projects, VPC Service Controls, CMEK on the restricted bucket — must be implemented in Phase 7, not deferred indefinitely |
| Deletion job untested in production | Medium (until Phase 7 verification runs) | Critical | Explicit quarterly restore/deletion drill requirement (governing doc §9.2.1) — schedule it as a recurring calendar item, not a one-time task |
| Unscrubbed `.env` in apgi-api git history | Low (content is placeholder-only, per INVENTORY.md) | Low-Medium | A `git filter-repo`/BFG pass before this repo is made more widely accessible; not urgent given current content, but flagged for hygiene |
| AWS-targeted terraform mistaken for ready-to-use GCP infra | Medium if not communicated | High (wasted effort, or worse, a rushed AWS deploy that contradicts the governing plan) | This document states explicitly: the existing `deployment/terraform/main.tf` is AWS and cannot be adapted, only rewritten from scratch for GCP (Phase 3) |
| Booking-prototype cluster shipped by accident (already merged to `main`) | Low once Phase 1 archives it | Medium (off-brand content live on production domain) | Phase 1 explicitly deletes/archives this cluster before any deploy phase runs |

### Indicative monthly GCP cost at launch traffic

Per the governing doc's own estimate (§9.4), which this plan adopts as the baseline:

- Cloud Run (API + frontend if containerized), scale-to-zero: **$10–40/mo**
- Cloud SQL, smallest HA-eligible instance: **$50–120/mo**
- Cloud Storage (raw trial data + static frontend): **$5–20/mo**
- BigQuery, modest query volume: **$10–50/mo**
- Logging, monitoring, Secret Manager, Artifact Registry: **$10–30/mo**
- **Total infra: roughly $85–260/mo at launch traffic**, doubled if staging runs continuously alongside production (staging can be scaled down/paused between active work to reduce this).

The governing doc's own framing is worth repeating here: infrastructure is not the real budget constraint. The paid panel ($2,000–5,000), IRB ($1,000–4,000), and privacy review ($1,000–3,000) — all Phase 7 human-action items — are together roughly 20× the annual cloud bill, and none of them are optional if the project intends to make any validated scientific or commercial claim later.
