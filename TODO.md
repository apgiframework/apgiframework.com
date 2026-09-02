# � APGI Framework — Implementation TODO

### Security Implementation

- [ ] **HSTS Header** — Web server deployment
- [ ] **CSRF Token Validation** — Server-side verification on state-changing requests
- [ ] **Rate Limiting** — 5/min on login, 3/hour on password reset
- [ ] **Account Lockout** — Lock after 10 failed attempts (30-min cooldown)
- [ ] **Password Reset Expiration** — 24-hour expiration, one-time use
- [ ] **Session Management** — HttpOnly cookie auth & validation
- [ ] **reCAPTCHA Verification** — Backend token verification
- [ ] **Webhook Signature Verification** — Stripe webhook security

### Infrastructure & Database

- [ ] **TLS/SSL Certificate** — Valid certificate deployment
- [ ] **Security Headers** — Web server configuration (Apache/Nginx)
- [ ] **Database Permissions** — Least privilege user access
- [ ] **Access Logging** — Security event logging & monitoring
- [ ] **Secure Configuration** — Environment variables for secrets

### UI/UX Polish

- [ ] **"Back to Top" Button** — Floating button visible after 300px scroll
- [ ] **Copy Button** — On code blocks (pattern in export-ui.js)
- [ ] **Print Stylesheet** — Optimized styles for printing
- [ ] **Last Updated Date** — Timestamp on content pages
- [ ] **Expandable FAQ** — Collapsible Q&A sections
- [ ] **Page Loading Animation** — Fade-in animation on page load
- [ ] **Toast Notifications** — Dismiss-able toast messages
- [ ] **Table of Contents** — Auto-generated TOC for long pages
- [ ] **Related Content Links** — "See Also" sections
- [ ] **Floating Contact Widget** — Persistent chat/contact widget

| Page | Rating | Verdict | Suggestions |
|---|---:|---|---|
| index.html | 88 | Ready | Strong home page; consolidate duplicates with `index-apgi.html` / `index-polaris.html`. |
| index-apgi.html | 82 | Not Ready | Duplicate homepage variant; choose canonical winner or remove from navigation. |
| index-polaris.html | 82 | Not Ready | Duplicate homepage variant; either ship as canonical or exclude. |
| apgi-landing.html | 84 | Ready | Good narrative landing page; tighten CTA hierarchy and ensure it does not compete with homepage. |
| Landing-Page.html | 60 | Do Not Include | Missing title/meta/canonical; design-system prototype naming; either integrate properly or remove. |
| papers-index.html | 90 | Ready | Strong research hub; add clearer publication/download status if relevant. |
| framework-paper.html | 87 | Ready | Solid paper page; add abstract summary and citation/export affordances. |
| liquid-networks-paper.html | 87 | Ready | Solid; fix any references to typo redirect and add citation/download affordances. |
| multi-scale-consciousness-paper.html | 87 | Ready | Strong content; add share/citation metadata and improve skimmable abstract. |
| epistemic-architecture-paper.html | 88 | Ready | Strongest paper page; add download/citation CTA. |
| apgi-series.html | 45 | Do Not Include | Redirect shim only; keep only if needed for legacy URLs, otherwise exclude from app listings. |
| lquid-networks-paper.html | 42 | Do Not Include | Typo redirect; useful only for typo recovery, not public navigation/sitemap. |
| apgi_protocol_reference.html | 74 | Not Ready | Good reference depth; missing description/canonical and filename style is inconsistent. |
| book-outline.html | 86 | Ready | Strong book page; fix bad mixed-case link to `Book-Available-Now.html#bundles`. |
| book-available-now.html | 62 | Not Ready | Missing image asset and many “coming soon” labels contradict “available now”. |
| apgi-assessment.html | 80 | Not Ready | Feature-rich, but very large inline JS and debug `window.testCalculations` should be production-cleaned. |
| assessment-onepage.html | 78 | Not Ready | Useful assessment variant; clarify whether it replaces or duplicates main assessment. |
| quiz-signature.html | 76 | Not Ready | Strong scripted quiz, but thin initial HTML and needs fuller intro/SEO fallback. |
| state-assessment.html | 73 | Not Ready | Interesting tool, but thin content and external Chart dependency need fallback validation. |
| apgi-signature.html | 72 | Not Ready | Good concept page; relies on CDN Tailwind/Lucide and needs richer body content. |
| app-explorer.html | 84 | Ready | Good product-style page; validate image dimensions/mobile rendering. |
| app-appendix.html | 82 | Ready | Good companion page; add clearer user path back to Explorer/Assessment. |
| apgi-experiments.html | 85 | Ready | Strong interactive/research page; add more context above models for first-time users. |
| apgi-software-system.html | 86 | Ready | Strong architecture/product page; reduce CDN reliance and clarify implementation status. |
| consciousness-visualization.html | 77 | Not Ready | Likely useful interactive, but static HTML is very thin; add explanatory fallback content. |
| neuromodulatory-cascade.html | 75 | Not Ready | Strong canvas scripting, but page copy is thin; add metadata-level explanation and controls fallback. |
| funnels.html | 74 | Ready | Good launcher; add more descriptive visible copy and confirm intended public inclusion. |
| funnels/1_individual_self_explorers.html | 77 | Ready | Best consumer funnel; verify Stripe/test purchase behavior before production. |
| funnels/2_therapists_coaches.html | 78 | Ready | Good professional funnel; tighten claims and add proof/examples. |
| funnels/3_academic_researchers.html | 82 | Ready | Strongest funnel; good depth, but shorten sections for conversion. |
| funnels/4_organizational_development.html | 70 | Not Ready | Promising, but thin and generic; add concrete organizational use cases. |
| funnels/5_educational_institutions.html | 66 | Not Ready | Uses emoji in H1 and feels less polished; add evidence, institution-specific outcomes. |
| funnels/6_healthcare_professionals.html | 68 | Not Ready | Healthcare claims need extra caution/disclaimers and evidence framing. |
| funnels/7_tech_industry_professionals.html | 70 | Not Ready | Good idea, but “adaptive cognitive patterns” needs clearer technical offer. |
| funnels/_internal/1_individual_self_explorers_journey.html | 48 | Do Not Include | Internal mockup; many H1s and generic ad content. |
| funnels/_internal/2_therapists_coaches_journey.html | 48 | Do Not Include | Internal journey/ad template; not public-page quality. |
| funnels/_internal/3_academic_researchers_journey.html | 49 | Do Not Include | Internal template; repeated generic social ad copy. |
| funnels/_internal/4_organizational_development_journey.html | 48 | Do Not Include | Internal template; lacks metadata/canonical and uses many H1s. |
| funnels/_internal/5_educational_institutions_journey.html | 48 | Do Not Include | Internal template; generic campaign copy should stay unpublished. |
| funnels/_internal/6_healthcare_professionals_journey.html | 48 | Do Not Include | Internal template; healthcare marketing needs stricter review before use. |
| funnels/_internal/7_tech_industry_professionals_journey.html | 48 | Do Not Include | Internal template; not suitable for app navigation. |
| funnels/_internal/ad-display.html | 46 | Do Not Include | Internal ad board; many H1s and generic “transform your mind” messaging. |
| funnels/_internal/social-media-ads.html | 40 | Do Not Include | Missing all referenced ad images; keep internal only until assets exist. |
| booking-index.html | 50 | Do Not Include | Unrelated booking prototype; broken link to `booking-design-showcase.html`. |
| booking-modern-saas.html | 48 | Do Not Include | Polished prototype, but unrelated to APGI production app and missing SEO metadata. |
| booking-dark-scientific.html | 48 | Do Not Include | Prototype only; exclude unless APGI booking is an actual product feature. |
| booking-warm-approachable.html | 48 | Do Not Include | Prototype only; no canonical/description and off-brand for app. |
| booking-bold-minimalist.html | 48 | Do Not Include | Prototype only; visually likely fine, but not production APGI content. |
| contact.html | 80 | Ready | Good utility page; test form/env config end to end. |
| privacy-policy.html | 84 | Ready | Solid legal page; confirm policy text matches actual data/export behavior. |
| terms-of-service.html | 84 | Ready | Solid; confirm medical/assessment disclaimers are legally sufficient. |
| sitemap.html | 78 | Not Ready | Useful, but should exclude internal, redirect, prototype, and not-ready pages. |
| 404.html | 72 | Ready | Functional; static audit shows very little text because much may be styled/hidden, but it has useful recovery links. |



| Page Name	Rating	Verdict	Key Issues	Priority
| index.html	82/100	✅ Ready	Add schema.org, lazy-loading	medium
| 404.html	75/100	❌ Exclude	No content, needs error page design	critical
| Landing-Page.html	68/100	❌ Exclude	Inline CSS, unclear purpose, duplicate of index.html	critical
| apgi-software.html	79/100	✅ Ready	Extract CSS to external file	high
| contact.html	77/100	✅ Ready	Add form validation, CAPTCHA	high
| privacy-policy.html	81/100	✅ Ready	Add TOC, changelog, print styles	medium
| apgi-assessment.html	88/100	✅ Ready	Add loading skeletons, auto-save	medium
| assessment-onepage.html	76/100	✅ Ready	Verify differentiation from main assessment	medium
| state-assessment.html	74/100	✅ Ready	Document use case	medium
| apgi-landing.html	65/100	❌ Exclude	Duplicate of index.html, redirect needed	critical
| apgi-software-system.html	72/100	❌ Exclude	Duplicate of apgi-software.html	critical
| apgi_protocol_reference.html	80/100	✅ Ready	Add copy-to-clipboard, sidebar nav	high
| app-appendix.html	77/100	✅ Ready	Add breadcrumb, better linking	medium
| app-explorer.html	79/100	✅ Ready	Add instructions, export feature	high
| book-available-now.html	81/100	✅ Ready	Add testimonials, sample chapters	high
| book-outline.html	78/100	✅ Ready	Add chapter descriptions, preview links	medium
| booking-bold-minimalist.html	65/100	❌ Exclude	Consolidate with other booking pages	critical
| booking-dark-scientific.html	65/100	❌ Exclude	Consolidate with other booking pages	critical
| booking-index.html	65/100	❌ Exclude	Consolidate with other booking pages	critical
| booking-modern-saas.html	65/100	❌ Exclude	Consolidate with other booking pages	critical
| booking-warm-approachable.html	65/100	❌ Exclude	Consolidate with other booking pages	critical
| consciousness-visualization.html	83/100	✅ Ready	Add animation controls, text alternative	medium
| epistemic-architecture-paper.html	79/100	✅ Ready	Add PDF download, citation export	high
| framework-paper.html	81/100	✅ Ready	Add DOI, related papers links	medium
| funnels.html	72/100	⚠️ Not Ready	Unclear purpose, potential internal tool	high
| index-apgi.html	68/100	❌ Exclude	Duplicate index.html, SEO issues	critical
| index-polaris.html	65/100	❌ Exclude	Unclear purpose, possible duplicate	critical
| liquid-networks-paper.html	80/100	✅ Ready	Add co-authors, funding info	medium
| liquid-networks-paper.html	20/100	❌ Exclude	⚠️ TYPO IN FILENAME - Rename to liquid-networks-paper.html	critical
| multi-scale-consciousness-paper.html	81/100	✅ Ready	Add methodology section	medium
| neuromodulatory-cascade.html	77/100	✅ Ready	Add interactive diagrams, animation	high
| papers-index.html	82/100	✅ Ready	Add search, filtering, sorting	high
| quiz-signature.html	80/100	✅ Ready	Add social sharing, export results	medium
| sitemap.html	79/100	✅ Ready	Add search box, update dates	medium
| terms-of-service.html	78/100	✅ Ready	Add TOC, version history	medium
