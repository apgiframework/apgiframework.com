#!/usr/bin/env python3
"""Smoke-test a running copy of the site (e.g. the built container).

Usage: scripts/verify_site.py http://localhost:8080

Checks, using only the standard library:
  1. Security headers are present on HTML, assets and 404 responses
     (nginx drops inherited add_header values in locations that declare their own).
  2. Pages that must not ship return 404.
  3. Every internal href/src on every sitemap page resolves with HTTP 200.
  4. Every URL in sitemap.xml resolves with HTTP 200.
Exit status is non-zero if anything fails.
"""
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

REQUIRED_HEADERS = [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
]
MUST_NOT_SHIP = [
    "/apgi-assessment.html",
    "/assessment-onepage.html",
    "/state-assessment.html",
    "/quiz-signature.html",
    "/apgi-signature.html",
    "/funnels/2_therapists_coaches.html",
    "/funnels/6_healthcare_professionals.html",
    "/TASKS.md",
    "/Dockerfile",
    "/.git/config",
]

base = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080").rstrip("/")
failures = []
cache = {}


def fetch(path):
    if path in cache:
        return cache[path]
    try:
        with urllib.request.urlopen(base + path, timeout=15) as r:
            out = (r.status, dict(r.headers), r.read())
    except urllib.error.HTTPError as e:
        out = (e.code, dict(e.headers), e.read())
    cache[path] = out
    return out


def fail(msg):
    failures.append(msg)
    print("FAIL", msg)


# 1. headers
for path in ["/", "/about.html", "/assets/css/site-enhancements.css", "/does-not-exist"]:
    status, headers, _ = fetch(path)
    lower = {k.lower() for k in headers}
    missing = [h for h in REQUIRED_HEADERS if h.lower() not in lower]
    if missing:
        fail(f"{path} ({status}) missing headers: {', '.join(missing)}")
    if path == "/does-not-exist" and status != 404:
        fail(f"/does-not-exist returned {status}, expected 404")

# 2. held pages
for path in MUST_NOT_SHIP:
    status, _, _ = fetch(path)
    if status != 404:
        fail(f"{path} returned {status}, expected 404")

# 3 + 4. sitemap and link crawl
status, _, body = fetch("/sitemap.xml")
if status != 200:
    fail(f"/sitemap.xml returned {status}")
    pages = []
else:
    locs = re.findall(r"<loc>([^<]+)</loc>", body.decode())
    pages = [urllib.parse.urlparse(u).path or "/" for u in locs]
    for path in pages:
        if fetch(path)[0] != 200:
            fail(f"sitemap URL {path} returned {fetch(path)[0]}")

refs = 0
for page in pages + ["/sitemap.html", "/404.html"]:
    status, headers, body = fetch(page)
    if status != 200 or "html" not in headers.get("Content-Type", ""):
        continue
    text = body.decode("utf-8", "ignore")
    for m in re.finditer(r'(?:href|src)="([^"]+)"', text):
        ref = m.group(1).split("#")[0].split("?")[0]
        if not ref or re.match(r"(https?:|mailto:|tel:|data:|javascript:|//|\$|\{|%)", ref):
            continue
        refs += 1
        target = urllib.parse.urljoin(page, ref)
        if fetch(target)[0] != 200:
            fail(f"{page} -> {ref} returned {fetch(target)[0]}")

print(f"checked {len(cache)} URLs, {refs} internal references, {len(pages)} sitemap pages")
if failures:
    print(f"{len(failures)} failure(s)")
    sys.exit(1)
print("OK")
