# APGI Infrastructure — as actually deployed

Ground-truth record of what exists in GCP, replacing guesswork in DEPLOY_PLAN.md's original phased plan with what was actually provisioned. Written after live deployment, not before.

**GCP project:** `apgiframework-web` (region: `us-central1`). Created fresh this session — the originally-assumed `apgi-web` project ID does not exist under any account we have access to, and the literal string is globally claimed by an unrelated GCP customer.

**Provisioned via:** direct `gcloud` commands, not Terraform. DEPLOY_PLAN.md's Phase 3 called for Terraform IaC — that's still an open task (see TASKS.md); everything below should be codified into `.tf` files as a follow-up so the current state is reviewable as a diff, not just discoverable by querying GCP directly.

---

## Resources

| Resource | Name | Notes |
|---|---|---|
| Cloud SQL (Postgres 15) | `apgi-core-db` | tier `db-g1-small`, 10GB auto-growing storage, daily backup at 03:00 |
| Cloud SQL database | `apgi_api_prod` | |
| Cloud SQL user | `apgi_app` | password generated, stored only in Secret Manager (`database-url`) |
| Memorystore Redis | `apgi-cache` | 1GB, Basic tier, `redis_7_0` |
| VPC connector | `apgi-connector` | `10.8.0.0/28`, lets Cloud Run reach Memorystore (Cloud SQL uses the separate built-in connector, doesn't need this) |
| Artifact Registry | `apgi-images` | Docker repo, holds `frontend` and `apgi-api` images |
| Cloud Run service | `apgiframework-com` | the frontend, `--allow-unauthenticated` |
| Cloud Run service | `apgi-api` | the backend, `--allow-unauthenticated`, `ENVIRONMENT=staging` (see below) |
| Cloud Run job | `apgi-migrate` | currently configured for `alembic stamp head`; **switch back to `alembic upgrade,head` before the next real schema change** |
| Domain mapping | `www.apgiframework.com` → `apgiframework-com` | |
| Domain mapping | `api.apgiframework.com` → `apgi-api` | |
| Uptime check | `apgiframework-com-uptime-XbmqCIUAwis` | HTTPS, `/`, every 5 min |
| Uptime check | `apgi-api-uptime-2H5RlLx1ZH0` | HTTPS, `/health`, every 5 min |
| Alert policy | `apgiframework-com down` | fires on uptime check failure |
| Alert policy | `apgi-api down` | fires on uptime check failure |
| Notification channel | "APGI ops email" | `info@apgiframework.com` |
| Cloud Build connection | `apgi-github` | 2nd-gen GitHub App connection, authorized by the operator |
| Cloud Build repository | `apgiframework-com`, `apgi-api` | linked under the `apgi-github` connection |
| Cloud Build trigger | `deploy-apgiframework-com` | push to `main` on `apgiframework.com` → builds `cloudbuild.yaml`, deploys to `apgiframework-com` |
| Cloud Build trigger | `deploy-apgi-api` | push to `main` on `apgi-api` → builds `cloudbuild.yaml`, deploys to `apgi-api` |
| Org policy override | `iam.allowedPolicyMemberDomains` on this project only | `allowAll: true` — required to let the two Cloud Run services be publicly reachable, since the `apgiframework.com` Google Workspace org has Domain Restricted Sharing on by default. **Scoped to this project — does not affect your other GCP projects.** |

## Why `apgi-api` runs in `staging`, not `production`

`app/config.py` refuses to start in `production` mode without real Stripe keys, an SMTP server, a webhook secret, a PII encryption key, and an audit signing key. None of those exist yet — I generated the two secrets that don't need a third-party account (`jwt-secret-key`, `cursor-signing-key`) and left the rest unset rather than fabricate values that would silently disable security features while looking configured. `staging` mode skips those specific checks; everything else (real Postgres, real Redis, DB/Redis connection validation) still applies.

**To move to `production`:** add real values to Secret Manager for `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `SMTP_SERVER` (+ related SMTP vars), `WEBHOOK_SECRET_KEY`, `PII_ENCRYPTION_KEY`, `AUDIT_SIGNING_KEY`, then update the Cloud Run service's `ENVIRONMENT` env var. Don't flip the switch without the values — the app will refuse to start, which is the correct behavior.

## IAM grants made this session

| Principal | Role | Scope | Why |
|---|---|---|---|
| `1037852707756-compute@developer.gserviceaccount.com` (default compute SA — used as the Cloud Build and Cloud Run runtime identity) | `roles/cloudbuild.builds.builder` | project | Cloud Build couldn't read its own uploaded source tarball without this — new projects don't always get the automatic grant immediately |
| same | `roles/storage.objectViewer` | `gs://apgiframework-web_cloudbuild` bucket only | same issue, belt-and-suspenders fix |
| same | `roles/secretmanager.secretAccessor` | project | lets Cloud Run read the 4 secrets at runtime |
| same | `roles/cloudsql.client` | project | lets Cloud Run connect to Cloud SQL via the built-in connector |
| `info@apgiframework.com` | `roles/orgpolicy.policyAdmin` | **organization** (936901169175) | needed to override Domain Restricted Sharing at the project level — Organization Admin (which this account already had) doesn't include this by default |
| `1037852707756@cloudbuild.gserviceaccount.com` (Cloud Build's own service agent, distinct from the compute default SA above) | `roles/run.admin`, `roles/iam.serviceAccountUser`, `roles/artifactregistry.writer`, `roles/logging.logWriter`, `roles/secretmanager.admin` | project | runs the two CI/CD triggers — builds the image, pushes it, deploys to Cloud Run. `secretmanager.admin` was specifically required just to create the GitHub connection itself (Cloud Build stores the GitHub OAuth token as a secret it manages) |

No `Owner`-level role was granted to any service account. The compute default SA's grants are scoped to exactly what Cloud Build and Cloud Run need — not a blanket Editor/Owner grant.

**Still open:** a dedicated, least-privilege service account per service (rather than reusing the default compute SA for both Cloud Build and Cloud Run runtime) — using the default SA for everything was the fast path to get this live today, not the least-privilege end state DEPLOY_PLAN.md's own IAM-matrix goal describes.

## Secrets — current state and rotation

| Secret | Exists? | Rotation schedule |
|---|---|---|
| `database-url` | yes | rotate the underlying DB password every 90 days; update the secret value, no app redeploy needed (Cloud Run reads `:latest` at each cold start) |
| `redis-url` | yes | Memorystore has no built-in password by default on this tier; if AUTH is enabled later, same 90-day rotation applies |
| `jwt-secret-key` | yes | rotating this invalidates all issued tokens — rotate on a suspected compromise, or yearly as routine hygiene, with a maintenance-window heads-up (not silently) |
| `cursor-signing-key` | yes | same rotation caution as JWT — invalidates in-flight pagination cursors |
| `webhook-secret-key`, `pii-encryption-key`, `audit-signing-key` | **no — not created** | create when `production` mode is actually needed; `pii-encryption-key` rotation needs a re-encryption migration plan, not just a secret swap, since it's used to encrypt data at rest |
| Stripe / SMTP credentials | **no — not created** | human action: obtain real credentials from Stripe/your email provider first |

No secret value was ever printed to this conversation or committed to the repo — all four created secrets were piped directly into `gcloud secrets create` from a local variable, and the one temp file holding a generated password was deleted immediately after use.
