# Deploy and domain runbook

Step-by-step procedures for the three changes that cannot be made from the repository: choosing the deploy pipeline, the apex domain, and the email DNS records. Written 2026-10-30 from observed state (public DNS, HTTP requests, GitHub Actions logs and the Namecheap Advanced DNS screen). Nothing here was run against GCP or Namecheap by the author, so check each command's output before moving to the next step.

Project: `apgiframework-web` (number `1037852707756`, from `INFRASTRUCTURE.md`). Region: `us-central1`. Frontend service: `apgiframework-com`.

## Current state

| Item | State |
|---|---|
| Automatic deploy | Cloud Build trigger `deploy-apgiframework-com` (push to `main` runs `cloudbuild.yaml`). Observed working: the merge of PR #4 reached `www` in about two minutes. |
| GitHub Actions deploy | `.github/workflows/deploy.yml`, **manual dispatch only**. Never succeeded: secrets `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_SERVICE_ACCOUNT` are not set. |
| `www.apgiframework.com` | CNAME `ghs.googlehosted.com.`; Cloud Run domain mapping; HTTPS works; canonical host. |
| `apgiframework.com` (apex) | Namecheap **URL Redirect Record** (`@` -> `https://www.apgiframework.com/`, "Unmasked"), observed as a **302**. No HTTPS listener, so `https://apgiframework.com` fails. |
| Email DNS | MX `smtp.google.com` (priority 1) and DKIM present. **No SPF and no DMARC record.** |
| Site contact address | `info@apgiframework.com` (the previously published `support@`/`legal@apgi-framework.com` used a domain that does not exist). |

---

## 1. Use GitHub Actions as the primary deploy

**Should you?** Cloud Build already works and needs no secrets. Switch only if you want CI and deploy in one place (GitHub), with deploy logs next to the pull request. The cost is a Workload Identity Federation setup to maintain. Never leave both pipelines enabled: they would deploy the same service at the same time.

You need: Owner or Editor on `apgiframework-web`, `gcloud` signed in as that user, and admin on the GitHub repository.

### 1.1 Enable the APIs

```bash
gcloud services enable iamcredentials.googleapis.com sts.googleapis.com \
  run.googleapis.com artifactregistry.googleapis.com \
  --project=apgiframework-web
```

### 1.2 Create the federation and the deploy service account

These are the commands from the comment block at the top of `deploy.yml`. Run them once.

```bash
PROJECT_ID=apgiframework-web
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
REPO="apgiframework/apgiframework.com"
```

```bash
gcloud iam workload-identity-pools create github-pool \
  --project="$PROJECT_ID" --location=global --display-name="GitHub Actions"
```

```bash
gcloud iam workload-identity-pools providers create-oidc github-provider \
  --project="$PROJECT_ID" --location=global --workload-identity-pool=github-pool \
  --display-name="GitHub Actions" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
  --attribute-condition="assertion.repository_owner == 'apgiframework'" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

```bash
gcloud iam service-accounts create github-deployer \
  --project="$PROJECT_ID" --display-name="GitHub Actions Cloud Run deployer"
```

```bash
for role in roles/run.admin roles/artifactregistry.writer roles/iam.serviceAccountUser; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:github-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="$role"
done
```

Let only this repository impersonate that account:

```bash
gcloud iam service-accounts add-iam-policy-binding \
  "github-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
  --project="$PROJECT_ID" --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/attribute.repository/${REPO}"
```

Notes:
- `INFRASTRUCTURE.md` records that this project overrides the org's Domain Restricted Sharing policy. If the last command is rejected with a "policy constraint" error, that override is the thing to check.
- `roles/iam.serviceAccountUser` is granted project-wide here for simplicity. A tighter grant is on the Cloud Run runtime service account only (the default compute account, `1037852707756-compute@developer.gserviceaccount.com`).

### 1.3 Set the two repository secrets

Print the two values:

```bash
gcloud iam workload-identity-pools providers describe github-provider \
  --project=apgiframework-web --location=global --workload-identity-pool=github-pool \
  --format='value(name)'
```

Expected values:

| Secret name | Value |
|---|---|
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/1037852707756/locations/global/workloadIdentityPools/github-pool/providers/github-provider` |
| `GCP_SERVICE_ACCOUNT` | `github-deployer@apgiframework-web.iam.gserviceaccount.com` |

In GitHub: repository **Settings > Secrets and variables > Actions > New repository secret**, once per row. (They must be repository secrets, or environment secrets if you later add an environment to the job; the workflow reads the `secrets` context.) With the GitHub CLI:

```bash
gh secret set GCP_WORKLOAD_IDENTITY_PROVIDER --repo apgiframework/apgiframework.com \
  --body "projects/1037852707756/locations/global/workloadIdentityPools/github-pool/providers/github-provider"
gh secret set GCP_SERVICE_ACCOUNT --repo apgiframework/apgiframework.com \
  --body "github-deployer@apgiframework-web.iam.gserviceaccount.com"
```

### 1.4 Test it while Cloud Build is still active

GitHub: **Actions > Deploy to Cloud Run > Run workflow** (branch `main`). The first step, "Check deploy configuration", should now pass and every later step should run. Then confirm what is serving:

```bash
gcloud run services describe apgiframework-com --region=us-central1 --project=apgiframework-web \
  --format='value(status.latestReadyRevisionName,status.traffic)'
python3 scripts/verify_site.py https://www.apgiframework.com
```

Do not continue until the manual run is green and the verifier prints `OK`.

### 1.5 Switch over

1. **Re-enable the push trigger.** In `.github/workflows/deploy.yml` replace

   ```yaml
   on:
     workflow_dispatch: {}
   ```

   with

   ```yaml
   on:
     push:
       branches: [main]
     workflow_dispatch: {}
   ```

   and delete the "MANUAL FALLBACK ONLY" paragraph in the header comment. Commit it through a pull request.

2. **Disable the Cloud Build trigger** (disable, do not delete, so you can roll back). Console: **Cloud Build > Triggers**, pick the region, open the **⋮** menu on `deploy-apgiframework-com`, choose **Disable**. Or with the CLI (second-generation triggers are regional; find the region first):

   ```bash
   gcloud builds triggers list --project=apgiframework-web --region=us-central1
   gcloud builds triggers list --project=apgiframework-web --region=global
   ```

   ```bash
   gcloud builds triggers export deploy-apgiframework-com --region=REGION \
     --project=apgiframework-web --destination=trigger.yaml
   # edit trigger.yaml: set  disabled: true
   gcloud builds triggers import --source=trigger.yaml --region=REGION --project=apgiframework-web
   ```

   Leave `deploy-apgi-api` alone: it deploys the backend, a different service.

3. **Confirm.** Merge any small change. You should see exactly one "Deploy to Cloud Run" run in GitHub Actions and no new build in **Cloud Build > History** for `apgiframework-com`.

**Rollback:** re-enable the Cloud Build trigger, and put `deploy.yml` back to manual dispatch.

---

## 2. The apex domain

Today `http://apgiframework.com` redirects (302) to `www`, and `https://apgiframework.com` fails, because Namecheap's redirect service cannot terminate HTTPS for the apex. Every page declares `https://www.apgiframework.com` as canonical, so search engines are not affected, but people who type or paste the apex over HTTPS see an error. Any older link that uses the apex (papers, registrations, DOI metadata) breaks the same way.

### 2.1 Quick fix: make the redirect permanent (302 -> 301)

Namecheap: **Domain List > Manage `apgiframework.com` > Advanced DNS**. On the **URL Redirect Record** row (host `@`, value `https://www.apgiframework.com/`), open the redirect-type control (the screenshot shows **Unmasked**), choose the **Permanent (301)** option, and save with the green tick. Labels differ between Namecheap UI versions; judge by the result:

```bash
curl -sI http://apgiframework.com/ | head -3
```

You want `HTTP/1.1 301 Moved Permanently` and `Location: https://www.apgiframework.com/`. This still leaves `https://apgiframework.com` broken.

### 2.2 Recommended: make `https://apgiframework.com` work

Decision: **yes, make it work.** It costs a few DNS records, and it removes the error for anyone using the bare domain. The site redirects apex requests to `www` itself (an nginx rule in `nginx.conf.template`), so `www` stays the only canonical host.

Order matters.

1. **Merge and deploy the pull request that contains the nginx apex rule first.** Without it the apex would serve a duplicate copy of the site instead of redirecting.
2. **Confirm domain ownership is verified for the account that creates the mapping.** The `google-site-verification` TXT record is already on `@` (it was needed for the `www` mapping). Check the signed-in account owns it:

   ```bash
   gcloud domains list-user-verified
   ```

3. **Create the mapping.**

   ```bash
   gcloud beta run domain-mappings create --service=apgiframework-com \
     --domain=apgiframework.com --region=us-central1 --project=apgiframework-web
   ```

4. **Read the records Google wants.** Use exactly what this prints; do not copy addresses from memory:

   ```bash
   gcloud beta run domain-mappings describe --domain=apgiframework.com \
     --region=us-central1 --project=apgiframework-web \
     --format='yaml(status.resourceRecords)'
   ```

   Expect several `A` (IPv4) and several `AAAA` (IPv6) entries.

5. **Change Namecheap Advanced DNS.** In one sitting:
   - **Delete** the URL Redirect Record on host `@`. It cannot coexist with A/AAAA records on the same host.
   - **Add** one **A Record** for each IPv4 address, host `@`, TTL Automatic.
   - **Add** one **AAAA Record** for each IPv6 address, host `@`.
   - Leave alone: the `www` and `api` CNAMEs, the MX record, and every TXT record. A/AAAA records on `@` do not conflict with them.

6. **Wait for the certificate**, usually minutes, sometimes a few hours. Until then `https://apgiframework.com` still fails:

   ```bash
   gcloud beta run domain-mappings describe --domain=apgiframework.com \
     --region=us-central1 --project=apgiframework-web \
     --format='yaml(status.conditions)'
   ```

   Wait for `CertificateProvisioned` to be `True`.

7. **Verify:**

   ```bash
   curl -sI https://apgiframework.com/about.html | head -5
   ```

   Expect `301` and `Location: https://www.apgiframework.com/about.html`.

Cloud Run domain mappings are a preview feature with limited region support; `us-central1` is supported. If you later need more control, a global load balancer is the alternative.

### 2.3 If you decide not to serve the apex over HTTPS

Do 2.1 only, and accept that `https://apgiframework.com` will keep showing a connection error. This is not recommended.

---

## 3. Email DNS (found in the Namecheap screenshot)

The mail records from the screenshot: MX `smtp.google.com` priority 1 (Google's simplified one-record setup, valid), DKIM at `google._domainkey`, and the site-verification TXT. Public DNS confirms there is **no SPF and no DMARC record**, which makes outgoing mail from `@apgiframework.com` more likely to be treated as spam, and the contact form's replies depend on it.

Add in Namecheap Advanced DNS:

| Type | Host | Value |
|---|---|---|
| TXT Record | `@` | `v=spf1 include:_spf.google.com ~all` |
| TXT Record | `_dmarc` | `v=DMARC1; p=none; rua=mailto:info@apgiframework.com` |

Several TXT records on `@` are normal; only one may start with `v=spf1`. Start DMARC at `p=none` (monitor), then tighten to `quarantine` once the reports look clean. In the Google Workspace admin console, also confirm DKIM signing is **started** for the domain.

The site now publishes `info@apgiframework.com` as the contact address. Confirm that mailbox receives mail. If you want `support@` and `legal@`, create them as Workspace aliases and change the three places that use `info@` (`contact.html` twice, `terms-of-service.html` once).

---

## 4. Checking it from outside

```bash
curl -s "https://dns.google/resolve?name=apgiframework.com&type=A"
curl -s "https://dns.google/resolve?name=apgiframework.com&type=TXT"
curl -s "https://dns.google/resolve?name=_dmarc.apgiframework.com&type=TXT"
python3 scripts/verify_site.py https://www.apgiframework.com
```

The same verifier runs daily against production (`.github/workflows/verify-production.yml`) and against the built container on every pull request.
