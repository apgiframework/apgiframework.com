# APGI Claim-Discipline Audit

**Governing rules**, drawn from the project's own scientific plan:

- **(a) Clinical language** — banned from all user-facing output: diagnosis, disorder, symptom, condition, treat/treatment, therapy/therapeutic, anxiety, depression, ADHD, trauma, and any profile name with clinical resonance (§7.5 of the governing doc).
- **(b) Wellness/spiritual language** — the Neural Glow brand's forbidden-language list, extended per §7.5 from wellness/spiritual terms to clinical ones. **The exact wellness/spiritual word list was not found in this repo's local copy of the design system (`_ds/`)** — findings below use heuristic judgment and are flagged lower-confidence; the canonical list should be confirmed against the `apgi-design` Neural Glow skill as a follow-up.
- **(c) Thermodynamic/info-theoretic overclaims** — the governing doc states explicitly that channel cost c_ch, broadcast commitment cost c_bc, broadcast amplification A, ATP-per-bit accounting, the Landauer floor, and kappa are Tier-1-rated with kappa **unmeasured**, and nothing changes that. These must never be presented as validated, established, measured, or proven.
- **(d) Latent APGI parameter exposure** — the seven-dimensional state vector x_t = [S_t, θ_t, Π_e, Π_i, |ε_e|, |ε_i|, β] is gated behind the K7 identifiability test (§3.6 of the governing doc), which has not passed. Until it does, these values (or their direct proxies — ε/π/θ/β, "prediction error," "ignition threshold," "precision," "somatic bias") must never appear in API responses, LLM prompts, generated reports, chart/axis labels, dashboards, or quiz results.
- **(e) Unbacked percentile/norm claims** — any percentile or "you scored higher than X%" claim must cite a real, versioned reference sample. A percentile computed on a fabricated or too-small sample is explicitly called out in the governing doc as "a fabrication with a decimal point."

---

## §0. The seven quiz profiles

| # | Name | Line | Clinical-resonance assessment |
|---|---|---|---|
| 1 | The Overloaded Scanner | 408 | No resonance in the name; its `typicalFailures` list includes the literal phrase "Anxiety loops" (line 419) — a banned term inside a delivered result. |
| 2 | The Hypervigilant Analyst | 434 | **Clinical resonance.** "Hypervigilant" is clinical/trauma nomenclature (commonly used for PTSD, panic, anxiety disorders). Borderline-High. |
| 3 | The Distractible Creator | 460 | Moderate — "distractible" evokes ADHD without naming it. Low-Medium. |
| 4 | The Rigid Executor | 485 | Moderate — "rigid" is also used elsewhere on the site (`apgi-signature.html:429`) as the descriptor for its "OCD Signature" preset, so the same trait-word does double duty as an OCD stand-in. Medium. |
| 5 | The Detached Strategist | 509 | Moderate — combined with `coreIssue: "Weak embodiment... reduce motivation"` and `typicalFailures: ["Flat affect", ..., "Burnout through neglect"]`, reads close to depressive/dissociative phenotyping. Medium. |
| 6 | The Anxious Reactor | 535 | **Direct clinical resonance — highest severity of the seven.** The banned word "Anxious" is the profile's primary identifying label, delivered as a user's result. |
| 7 | The Balanced Operator | 560 | Clean. |

Each profile also carries a `signature: {theta, epsilon, pi, beta}` object rendered verbatim to the user — a second, independent violation (see §D-3).

**Secondary, inconsistent system found:** `app-explorer.html` (lines 850–940) defines a separate "Eight Cognitive Profiles" taxonomy (Sensitive Integrator, Analytical Guard, Adaptive Balancer, Open Explorer, Contemplative Anchor, Somatic Navigator, Cognitive Architect, Dynamic Responder). None of the eight names carry clinical resonance — clean on claim-discipline grounds — but its existence alongside the 7-profile system is a product-consistency problem worth noting separately.

---

## Category A — Clinical language

### A-1 — CRITICAL — `funnels/6_healthcare_professionals.html`
The single highest-risk finding in the audit. The entire page is built as a medical/clinical product pitch:

- L6/7/10: `<title>APGI Clinical Integration | Whole-Person Healthcare</title>`; "decision-support tools for healthcare professionals working with cognitive and behavioral patterns."
- L260: `<div class="logo">APGI Clinical</div>`
- L276–277: `"Why do some chronic pain patients respond to treatment while others don't?"`
- L280–281: `"maps the cognitive patterns that predict treatment resistance—before you waste months on ineffective interventions."`
- L290/293/297/301/312: a "Treatment Response Tracking" block claiming `Pain Intensity ↓42%`, `Treatment Adherence ↑68%`, `Cognitive Flexibility ↑31%` from a "6-month chronic pain treatment, biometric integration" study.
- L321–408: "Clinical Features," "EHR Integration," "Treatment Tracking," "Patient Education," "Clinical Insights," "HIPAA Compliance," "Clinical Validation," "Clinical Practice Packages."
- L390–400: `"APGI mapping is designed to help clinicians identify cognitive patterns that may correlate with treatment resistance..."`; `"Clinical validation studies are ongoing. We're looking for practices interested in piloting..."`
- L408–410: `"Certified for medical practices, clinics, rehabilitation centers, and hospitals"`
- L423: `Treatment protocol templates`
- **L512–517 — the single most dangerous line on the site: `"Current APGI use qualifies as clinical decision support tool (not medical device under FDA guidelines)... Peer-reviewed in: Pain Medicine, Journal of Psychosomatic Research, Psychotherapy and Psychosomatics."`** This is an unqualified FDA regulatory classification claim plus a citation to three real, named peer-reviewed journals with no corresponding publication anywhere (`apgi-api/docs/COMPLIANCE.md` was grepped for FDA/HIPAA/clinical/peer-review — zero hits).

**Suggested replacement:** retire this page entirely pending real legal/regulatory review, or rewrite from scratch as a research-tool pitch with no clinical/treatment/FDA/journal language.

### A-2 — CRITICAL — `funnels/2_therapists_coaches.html`
- L881–882: `"Secure, HIPAA-compliant platform designed specifically for therapeutic and coaching practice"`
- L911: `"framework language into your clinical documentation"`
- L950/953: "Clinical Impact" section header
- L961: `"Using APGI, I reduced client 'aha moment' time from 6 sessions to 2."`
- L969–970: testimonial attributed to **"Dr. Sarah Chen, Clinical Psychologist"** — unverifiable identity presented as a real practitioner endorsement.
- **L1099–1101: `NBCC Approved`, `APA Certified`, `NASW Recognized`** — three real professional-body accreditation badges (National Board for Certified Counselors, American Psychological Association, National Association of Social Workers) with no evidence of any such accreditation anywhere in either repo.

**Suggested replacement:** remove the three CE badges and the named testimonial entirely unless real accreditation letters and documented consent exist; replace "therapeutic"/"clinical documentation"/"Clinical Impact" with "coaching-practice"/"session notes"/"Practitioner Results."

### A-3 — CRITICAL — `apgi-signature.html`
- L75: `"An APGI signature is the brain's ignition fingerprint for a state or disorder."`
- L210–233: four preset buttons literally labeled **Anxiety**, **OCD**, **Psychosis**, **Depression**.
- L416–446: preset objects named `"Acute Anxiety"`, `"OCD Signature"` (desc: "Rigid error amplification, high π on threat"), `"Early Psychosis"`, `"MDD Signature"` (desc: "Suppressed reward ε, high threshold θt" — MDD is the clinical abbreviation for Major Depressive Disorder).

This is a public, interactive page that lets any visitor load a live "OCD," "Psychosis," or "MDD" parameter preset and watch a simulated "Ignition Monitor" respond — functionally a public disorder-simulator toy. Also a Category D violation (§D-5) since the raw ε/π/θ_t/β sliders are the literal gated parameters.

**Suggested replacement:** rename presets to non-clinical state labels ("Threat-Reactive," "High-Rigidity," "Low-Signal," "Detached") and remove "disorder"/"MDD"/"OCD"/"Psychosis" entirely. Recommend this page not go live pre-launch regardless.

### A-4 — CRITICAL — `state-assessment.html`
- L1069: delivered result `name: "Anxiety"` (`e:4.5, p:4.5, t:-32.5, b:2.0`)
- L1095: delivered result `name: "Depression"` (`e:-4.0, p:-2.5, t:40.0, b:0.8`)
- L2085–2087: `Anxiety: "threat-biased processing with lowered ignition thresholds."`; `Depression: "negative filtering with elevated thresholds for positive content."`

A user answers questions and the tool tells them their result is literally "Anxiety" or "Depression" with clinical-sounding mechanism text — the closest thing on the site to an informal diagnosis.

**Suggested replacement:** rename to non-clinical process states ("Threat-Weighted Processing," "Low-Reward Filtering") and strip the diagnostic-sounding mechanism text.

### A-5 — HIGH — `assessment-onepage.html`
- L2302: `"...Risk of anxiety/hypervigilance if errors are threat-related."`
- L2326: `"...vulnerable to somatic anxiety/amplification."`

Dynamically generated from the user's own answers and shown to them directly. Also see §D-2 (same block leaks raw parameter values).

**Suggested replacement:** "may notice stronger reactions to unexpected input" / "bodily sensations may register more strongly."

### A-6 — HIGH — `multi-scale-consciousness-paper.html`
- L925: `"Psychiatric conditions can be reframed as failures of temporal coherence across levels — with specific APGI parameters as intervention targets."`
- L931/940/949/958: tags reading `PTSD`, `Depression`, `Dissociation`, `Autism`.

"Intervention targets" is treatment-adjacent overclaim sitting directly on named DSM-adjacent conditions.

**Suggested replacement:** "these named states are illustrative theoretical mappings, not clinical claims"; drop "intervention targets."

### A-7 — HIGH — `framework-paper.html`
- L932: `"...explaining variability in anxiety, autism, and depersonalization phenotypes."`
- L979: `"...supports framework's clinical phenotyping predictions"` (attributed to a real citation, implying existing literature already validates APGI's own predictions)
- L1002–1004: `Psychiatric Phenotyping` — `"Computational biomarkers for anxiety, autism, and depersonalization based on precision weighting profiles."`

Declarative ("explaining," "biomarkers") rather than hedged, contradicting the governing doc's Tier-1/unmeasured posture.

**Suggested replacement:** "may help *generate hypotheses about* variability in..." / "Proposed (unvalidated) computational correlates..."

### A-8 — MEDIUM — `funnels/5_educational_institutions.html`
L311–315: `"Wellness Integration" — "Connect cognitive patterns with mental health support for holistic student care."` (also a Category B hit, see B-1.)

### A-9 — LOW — `app-appendix.html:920`
`"Clinical applications and psychiatric disorders"` — a table-of-contents label for a bibliography/reference section, not a delivered per-user claim.

### A-10 — reviewed, not a violation — `apgi_protocol_reference.html:639`
Describes a proposed research protocol on real clinical populations (VS/MCS patients) using correctly hedged language ("tests whether... can predict"). Legitimate protocol description; keep hedged if edited.

### A-11 — LOW-MEDIUM — `liquid-networks-paper.html:955-958`
`"Disorders of Consciousness — Distinguishing coma from minimally conscious state via reservoir dimensionality and ignition probability signatures."` Presented as a present-tense capability card rather than a hedged future possibility.

---

## Category B — Wellness/spiritual language (heuristic — canonical list not found locally, confirm against `apgi-design` skill)

### B-1 — MEDIUM — `funnels/5_educational_institutions.html:312-315`
`"🧘 Wellness Integration" / "...holistic student care."` **Suggested replacement:** "Cross-referral note-sharing with student support services."

### B-2 — LOW — `funnels/7_tech_industry_professionals.html:499`
`"APGI personalization is designed to help wellness and productivity apps adapt..."` — refers to a third-party app category, not self-branding. Low confidence.

### B-3 — LOW — `app-explorer.html:763`
`"...progress through the assessment journey."` — likely fine as loose UX copy, not therapeutic-journey framing. Very low confidence.

### Cleared (checked, not violations)
`funnels/1_individual_self_explorers.html:900` — `"Vague 'wellness' advice"` appears inside a table *criticizing* competitors; not a self-referential hit. Numerous "energy" / "Free Energy Principle" / "metabolic energy" references across framework-paper.html, apgi-experiments.html, epistemic-architecture-paper.html, apgi-software.html, apgi-software-system.html are legitimate Friston Free Energy Principle physics usage — not wellness language.

---

## Category C — Thermodynamic/info-theoretic overclaims

No literal `kappa`, `ATP/bit`, `broadcast amplification`, or `channel cost` overclaim language was found anywhere in the frontend or in `apgi-api/docs/THEORY.md` (both grepped, zero hits). `epistemic-architecture-paper.html:846-970`'s Landauer's Principle discussion is presented as a hedged, general physical bridge-principle — **compliant, a good example to point to.**

A related and serious pattern was found instead: unbacked "validated" claims about the product itself, directly contradicted by the site's own correct disclaimer elsewhere.

### C-1 — HIGH — inconsistent validation claims
- `app-explorer.html:709`: `"A scientifically-validated psychological assessment..."`
- `app-explorer.html:744`: `"35 scientifically-validated questions across 7 dimensions..."`
- `app-explorer.html:1090`: `"Scientifically validated • Open source"`
- `apgi-software.html:641`: `"...translates these computational principles into a scientifically validated psychological assessment."`
- `apgi-experiments.html:883`: `"Validated Experiments" / "Rigorous experimental paradigms with empirical grounding"`

...directly contradicted by the correctly-hedged disclaimer already present on the homepages:
- `index.html:747`, `index-apgi.html:914`, `index-polaris.html:894`: `"...it has not been independently validated against ground-truth neural data at publication. All quantitative outputs should be interpreted as hypothesis-generating, not diagnostic."`

**Suggested replacement:** "a structured self-report tool based on the APGI theoretical framework (not yet independently validated)."

---

## Category D — Latent APGI parameter exposure (K7-gated) — most severe and widespread category

The gated vector (or its direct proxies ε/π/θ/β, "prediction error," "ignition threshold," "precision," "somatic bias") is delivered as a per-user numeric/verbal result in at least four quiz tools and in the production API schema. **No K7-gating logic, flag, or even a comment referencing "K7" or "identifiability" exists anywhere in the apgi-api codebase** (`docs/` and `app/` both grepped, zero hits).

### D-1 — CRITICAL — `apgi-assessment.html`
- L901–1146: results screen titled "Your Cognitive Processing Profile," four cards for **ε (Prediction Sensitivity)**, **π (Metacognitive Precision)**, **β (Somatic Integration)**, **θ (Perceptual Threshold)**, each with a raw score, a 95% CI, and a percentile.
- L3757–3810: PDF export prints `Prediction Sensitivity (ε): X/100 [95% CI: lower-upper]` and `Percentile: Xth` for all four.

**Suggested replacement:** remove or gate the results screen until K7 passes; replace with qualitative, non-numeric process descriptions only.

### D-2 — CRITICAL — `assessment-onepage.html`
- L1738–1777: "Your APGI Parameter Profile" — metric cards for **Prediction Error (ε)**, **Precision (π)**, **Threshold (θ)**, **Somatic Bias (β)**, each bound to a live numeric value.
- L2366: `"Based on your resting parameters (ε=X.X, π=X.X, θ=X.X)..."`
- L2221: `"...precision-weighted prediction error of X.X and threshold of X.X, your ignition probability is approximately X.X%..."`

**Suggested replacement:** same as D-1 — strip numeric parameter values from delivered text.

### D-3 — CRITICAL — `quiz-signature.html`
- L745–789: four parameters each scored 0–100 and displayed as `<score>/100` with a band label.
- L835–853: "Parameter Signature" block explicitly labels and displays Activation Threshold (θₜ), Prediction Error (ε), Precision Weighting (π), Somatic Bias (β) per matched archetype.

**Suggested replacement:** remove the "Parameter Signature" panel and per-item 0–100 scores; keep archetype name/description/tips only.

### D-4 — CRITICAL — `state-assessment.html`
- L2033–2058: `val-e`, `val-p`, `val-t`, `val-b` display as `+X.Xσ`/`+X.X%` etc. with interpretive text ("Large prediction mismatch," "Channel dominance") — direct numeric+verbal delivery of the gated vector.

**Suggested replacement:** same as above.

### D-5 — HIGH — `apgi-signature.html`
Covered in A-3; the interactive ε/π/θ_t/β sliders and the "Ignition Monitor"/"Phenomenological Profile" report (L503–569) are a live, public exposure of the gated parameters mapped onto named psychiatric presets.

### D-6 — MEDIUM — `apgi-software.html:642`
`"Map your unique processing patterns across four core parameters: Prediction Error Sensitivity (ε), Precision Allocation (π), Ignition Threshold (θₜ), and Somatic Bias (β)."` — marketing copy promising delivery of the gated parameters.

### D-7 — CRITICAL — `apgi-api/app/models/schemas.py` (production API response schemas)
- L1662–1666: `PrecisionState` — `exteroceptive`/`interoceptive` float fields (Π_e/Π_i)
- L1585–1591: `IgnitionState` — `threshold` field (θ_t), `total_signal`
- L1676–1687: `SystemStateResponse` — bundles ignition, precision, body, allostasis, metabolism, self_model into one response
- L1709–1716: `PredictionErrorsResponse` — `exteroceptive_stats`/`interoceptive_stats` (ε_e/ε_i)
- L1719–1728: `SomaticMarkersResponse` (β-adjacent)

### D-8 — CRITICAL — `apgi-api/app/routes/state.py` (live, wired endpoints, not dead code)
- L51–156: `GET /v1/sessions/{session_id}/state` → `SystemStateResponse` — returns θ_t and Π_e/Π_i directly, per session, per user.
- L331–392: `GET /v1/sessions/{session_id}/interoception` → `BodyState`
- L395–457: `GET /v1/sessions/{session_id}/prediction-errors` → `PredictionErrorsResponse`
- L460–526: `GET /v1/sessions/{session_id}/somatic-markers` → `SomaticMarkersResponse`

**This is the clearest, most direct violation of rule (d) in the entire audit** — production REST API contract, not marketing copy, with no gate anywhere in the codebase.

**Suggested replacement:** add an explicit K7-gate check (feature flag / capability check) in front of these four endpoints that returns 403/501 until identifiability passes; strip theta/precision/prediction-error/somatic fields from all public responses until then, or clearly label them internal/research-only.

### D-9 — MEDIUM — `apgi-api/web/Landing.html`
Marketing copy advertising the D-7/D-8 capability: L465 `"...prediction error trends and latency"`; L514 `"Full Somatic Tracking"`; L341 `"...ignition thresholds for your simulation"`; L577 `"...allostatic loops and prediction error functions."`

### D-10 — LOW — `apgi-api/web/checkout.html:575`
`"Favorable somatic bias registered. Payment has been securely finalized."` — playful checkout flavor text invoking "somatic bias" as a real per-user readout. Normalizes the term even though it isn't a genuine data exposure here.

---

## Category E — Unbacked percentile/norm claims

### E-1 — CRITICAL — `apgi-assessment.html`
- L724–727 (shown to every user pre-quiz): `"Results contribute to anonymous normative database (N = 1,247)"` — worded to imply an accumulating real sample.
- L1150–1157 (source comment, never shown to user): `"// NORMATIVE DATABASE (Simulated)"` followed by hardcoded `NORMATIVE_DATA = { epsilon: {mean: 55.2, sd: 14.8, n: 1247, reliability: 0.82}, ... }`.
- L1228–1231, 3332, 3336–3337, 3771–3804: `calculatePercentile()` computes and displays "Xth percentile" and 95% CIs against this admittedly-simulated dataset, with no disclosure to the user.

A direct, provable instance of the exact pattern the governing doc singles out — the sample is fabricated, static, and marketed as real and user-contributed.

**Suggested replacement:** remove all percentile/CI display until a real, versioned reference sample exists ("APGI Reference Sample v0.1, N=—, not yet collected"); never claim results "contribute to" a database that isn't real.

### E-2 — CRITICAL — `funnels/2_therapists_coaches.html`
- L863–865: `"Based on internal pilot study of 47 therapy clients (2023-2026). Average time to client-reported 'breakthrough moment' reduced from 6 to 2 sessions..."`
- L867–869: `"Client retention... vs. industry baseline of 68% (American Psychological Association, 2023)."` — attributes a specific statistic to the APA with no citation.
- L917–924: "Population Comparisons... normative benchmarks from our internal validation dataset," footnoted at 11px with "Internal pilot study data (2023-2026), not yet peer-reviewed" while the headline claim and the "Dr. Sarah Chen" testimonial run at full confidence.

### E-3 — CRITICAL — `funnels/3_academic_researchers.html`
- L1493–1504: "Journals Featuring APGI Research" lists Nature Human Behaviour, Psychological Science, Consciousness and Cognition, Cognitive Affective & Behavioral Neuroscience, Journal of Cognitive Neuroscience, Frontiers in Psychology — implying actual publication.
- L1509–1513 (same page): `"...we continue building out our published validation record"` — admits no publications yet.
- L1533–1534: "Not Yet Peer-Reviewed" badge on the same normative-database stat block.
- L1624–1636: precise-sounding fabricated statistics (N=2,847, N=312, "47 countries," "23 languages," "2019-2026") labeled "Peer-reviewed publication pending."
- L1613–1614: `"Preferred partner for NSF, NIH, and international research funding agencies"` — unbacked institutional claim.

This page directly contradicts itself within a few hundred pixels of scroll: top-tier journal publication claimed in one section, zero peer review admitted in the next.

### E-4 — CRITICAL — `funnels/6_healthcare_professionals.html`
Covered in A-1; the numeric efficacy claims (Pain Intensity ↓42%, Treatment Adherence ↑68%, Cognitive Flexibility ↑31% at L293/297/301) and the named-journal peer-review claim (L516-517) are Category E violations layered on top of the clinical framing.

### E-5 — cross-reference
`apgi-assessment.html` percentile displays (D-1/E-1) and `assessment-onepage.html`'s ignition-probability percentage (D-2) are cross-cutting D+E violations already detailed above.

---

## Summary — highest severity items, ranked

| # | Finding | File(s) | Category | Severity |
|---|---|---|---|---|
| 1 | Live production API returns raw gated parameters, no K7 gate anywhere in the codebase | `apgi-api/app/routes/state.py`, `app/models/schemas.py` | D | **Critical — shipping code, not marketing copy** |
| 2 | Unqualified FDA classification claim + fabricated journal citations | `funnels/6_healthcare_professionals.html` | A + E | **Critical — regulatory exposure** |
| 3 | Fabricated CE accreditation badges (NBCC/APA/NASW) + unverifiable clinical testimonial | `funnels/2_therapists_coaches.html` | A + E | **Critical** |
| 4 | Simulated normative database (N=1,247) presented as real and user-contributed | `apgi-assessment.html` | E | **Critical** |
| 5 | Self-contradicting publication claims (top journals named, then "not yet peer-reviewed" nearby) | `funnels/3_academic_researchers.html` | E | **Critical** |
| 6 | Raw K7 parameters delivered as quiz results | `apgi-assessment.html`, `assessment-onepage.html`, `quiz-signature.html`, `state-assessment.html` | D | **Critical** |
| 7 | Results/presets literally named "OCD," "Psychosis," "MDD," "Anxiety," "Depression" | `apgi-signature.html`, `state-assessment.html` | A + D | **Critical** |

**9 distinct files carry Critical findings**: `apgi-assessment.html`, `assessment-onepage.html`, `quiz-signature.html`, `state-assessment.html`, `apgi-signature.html`, `funnels/2_therapists_coaches.html`, `funnels/3_academic_researchers.html`, `funnels/6_healthcare_professionals.html`, and `apgi-api/app/routes/state.py` + `app/models/schemas.py` together.

**This audit blocks deployment of the affected surfaces.** The two most urgent items are the FDA/journal claim in `funnels/6_healthcare_professionals.html` (real regulatory exposure) and the live API parameter exposure in `apgi-api` (shipping code, cannot simply be "taken down" the way a marketing page can — requires a code change and a gate). See [DEPLOY_PLAN.md](DEPLOY_PLAN.md) for how this gates the phased plan.
