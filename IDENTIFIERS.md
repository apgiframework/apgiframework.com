# APGI Project Identifiers

Single source of truth for this project's identifier block. Every artefact this project emits — this repo, the archived release, the OSF registration, dataset cards, report footers, API responses — should carry the same block. Divergence between them is not cosmetic: a paper citing one DOI while the website cites another produces two apparent projects, and a reviewer who cannot reconcile them stops reading.

Copy this table verbatim into any README, `CITATION.cff`, site footer, or OSF wiki that needs it, rather than retyping the values by hand.

| Role | Identifier | Mutability |
|---|---|---|
| Researcher | https://orcid.org/0009-0005-0328-2896 | Permanent; trust anchor in place of an institution |
| Working project | https://osf.io/t5hcq | Mutable; the workspace, not the claim |
| Registration | https://osf.io/yk29g | Frozen; amended, never edited |
| Archive | https://doi.org/10.5281/zenodo.21632264 | Versioned; concept DOI resolves to latest |
| Code | https://github.com/apgiframework | Mutable; the tagged release is the citable unit |
| Public site | https://apgiframework.com | Mutable |
| API | https://api.apgiframework.com (versioned at `/v1`) | Contract-stable within a major version |
| Infrastructure | Google Cloud — separate production and research projects | — |

## Outstanding items (carried from the governing plan doc)

- **Two registrations, not one.** §0.1 of the governing plan requires an instrument registration and a separate criterion registration. Only one registry identifier exists today (`osf.io/yk29g`). Either create a second registration for the criterion pre-registration, or state explicitly within the existing one that it covers both, with the two analysis plans kept separable.
- **Confirm concept vs. version DOI.** The Zenodo identifier above needs confirming as the *concept* DOI (resolves to whatever is newest) or a specific *version* DOI (frozen to one release). Cite the concept DOI in prose; cite the version DOI only in a reproducibility appendix. A version DOI pasted into a paper freezes the citation to a release that will eventually be superseded, with no clean way to correct it after publication.
- **Ethics approval number** (governing doc §7.3) has no value yet — it attaches to the registration once an IRB/ethics review exists. Human action, not a repo task.

## Release-state labeling

Every public artefact should carry one of three maturity labels in its own metadata, not inferred from the fact that it exists:

- **pre-registered** — design is public, no participant data collected yet
- **pilot** — n < 200, timing and comprehension data only
- **calibrated** — K1–K3 have passed, norms are defensible

This repo and the archived release currently sit at **pre-registered**. A DOI is a locator, not a warrant — nothing on this site should read as evidence of a validated instrument until the label above actually says `calibrated`.
