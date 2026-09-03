# APGI Forbidden-Language List — wellness + clinical

Working draft. The canonical Neural Glow forbidden-language list (referenced by the governing plan doc, §7.5 / Phase 0A) was not found as a standalone document in this repo or in the local copy of the design system (`_ds/`). This draft is assembled from [CLAIM_AUDIT.md](CLAIM_AUDIT.md)'s findings plus the `apgi-design` skill's own brand-voice guidance, and should be treated as a working version pending confirmation against whatever the design team holds as canonical.

**Important conflict found while drafting this:** the `apgi-design` skill's own "Brand Voice in UI Copy" section explicitly recommends including a "research authority marker" — its own example text is *"47 peer-reviewed studies"* / *"47 research papers"* — as a required element of every hero section and marketing landing page. That is the exact fabricated statistic [CLAIM_AUDIT.md](CLAIM_AUDIT.md) (Category E) and this repo's [TASKS.md](TASKS.md) flag for removal, and it has now been removed from `funnels/3_academic_researchers.html`. **The skill's guidance and the claim-discipline findings directly contradict each other on this point.** Until the skill itself is updated, treat any specific-number "research authority marker" (peer-reviewed study counts, sample sizes, validation-study counts) as **forbidden unless it cites a real, checkable source** — never include one as a stock brand element.

---

## A. Clinical language

Banned from all user-facing output — copy, quiz results, generated reports, chart labels, API responses:

- diagnosis, diagnose, diagnostic
- disorder
- symptom
- condition (in a medical sense — "cognitive processing condition" etc.; "terms and conditions" is fine)
- treat, treatment, treats
- therapy, therapeutic (except when accurately describing a third party — e.g. "therapists" as a named audience segment — never as a claim about what APGI itself does)
- anxiety, anxious
- depression, depressive
- ADHD
- trauma, traumatic
- PTSD, OCD, MDD (or any other DSM/ICD abbreviation)
- psychosis, psychotic
- any profile, archetype, or result name with clinical resonance — including near-clinical trait words used as a stand-in (e.g. "hypervigilant," "rigid" when paired with an OCD-coded description, "flat affect")
- "clinical decision support," "clinical validation," "clinical documentation," "clinical practice," "EHR integration," "HIPAA-compliant" (unless the product genuinely is HIPAA-compliant and this has been legally verified)
- any FDA/medical-device regulatory classification claim ("qualifies as X under FDA guidelines," "not a medical device," etc.) — this is a legal determination, never marketing copy

## B. Wellness/spiritual language

Heuristic list — confirm against the canonical Neural Glow list when it's located:

- heal, healing
- journey (in a therapeutic/self-discovery sense — "assessment journey" as UI-progress copy is lower-risk but still worth avoiding)
- energy (in a non-physics sense — the Free Energy Principle / metabolic energy / thermodynamic energy usage in APGI's own research pages is fine and exempt)
- chakra
- manifest, manifestation
- spirit, spiritual, soul
- vibration (non-physics sense)
- alignment (self-help sense — "aligned with your true self," not e.g. CSS/layout alignment)
- wellness, holistic
- "transform your life," "unlock your potential," and similar generic self-help phrasing
- "you're doing it wrong" or any framing that pathologizes the reader's baseline state

## C. Unbacked validation / authority claims

Not from the original wellness/clinical list, but the single most common violation found in this audit — treat with equal severity:

- "scientifically validated," "clinically validated," "empirically validated," "rigorously validated" — banned unless K1–K3 have passed and the specific validation is cited
- "validated by," "peer-reviewed," "published in [journal]" — banned unless a real, checkable citation exists
- any specific-number research-authority marker ("47 peer-reviewed studies," "2,847-person validation database," "N=X" reliability figures) — banned unless sourced to a real, dated, checkable study or dataset card
- named professional accreditation or endorsement ("APA Certified," "NBCC Approved," named testimonials with professional titles) — banned unless the accreditation is real and documented
- "trusted by," "preferred partner of," institutional-partnership claims — banned unless a real, named, confirmable relationship exists

## D. Latent APGI parameter exposure

Not a wording list — a data-exposure rule, restated here because it governs copy too. Until a given parameter clears the K7 identifiability gate (governing doc §3.6), do not:

- name it in marketing copy as something the product measures or delivers to a user (θ_t, Π_e, Π_i, ε, β, "ignition threshold," "precision," "prediction error," "somatic bias" as a *personal result*)
- display a numeric score, confidence interval, or percentile derived from it
- imply the product tells the user their own value for it

Describing the *theoretical model* (what these symbols mean, how the framework is structured) is fine on research/framework pages — the violation is presenting one as a delivered, individual measurement before it clears K7. See [CLAIM_AUDIT.md](CLAIM_AUDIT.md) Category D for the full list of current violations still open.

---

## How this list was built

- Categories A, B (partial), C, D are drawn directly from [CLAIM_AUDIT.md](CLAIM_AUDIT.md)'s findings across both repos.
- Category A's core list (diagnosis/disorder/symptom/condition/treat/therapy/anxiety/depression/ADHD/trauma) is the exact list stated in the governing plan document, §7.5.
- Category C was added because it was the single largest source of findings in the audit and isn't covered by the original two-list framing ("wellness" vs. "clinical") — it's really a third category (unbacked authority claims) that deserves its own enforcement.
- The conflict noted at the top (the `apgi-design` skill's own brand-voice guidance recommending a fabricated-number authority marker) should be raised with whoever owns that skill so the skill itself gets corrected, not just this document.
