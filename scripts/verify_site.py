#!/usr/bin/env python3
"""Smoke-test a running copy of the site (e.g. the built container).

Usage: scripts/verify_site.py http://localhost:8080 [--apex-redirect]

  --apex-redirect  also check that requests carrying `Host: apgiframework.com`
                   get a 301 to the same path on https://www.apgiframework.com
                   (only meaningful against the container/localhost, where the
                   Host header can be set; production apex DNS is separate).

Checks, using only the standard library:
  1. Security headers are present on HTML, assets and 404 responses
     (nginx drops inherited add_header values in locations that declare their own).
  2. Pages that must not ship return 404.
  3. Every internal href/src on every sitemap page resolves with HTTP 200.
  4. Every URL in sitemap.xml resolves with HTTP 200.
  5. (with --apex-redirect) the apex Host gets a permanent redirect to www.
  6. Every sitemap page's <link rel="canonical"> equals its own sitemap <loc>
     (same host and path), and robots.txt points at the same sitemap host.
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

args = [a for a in sys.argv[1:] if not a.startswith("--")]
base = (args[0] if args else "http://localhost:8080").rstrip("/")
check_apex = "--apex-redirect" in sys.argv
failures = []
cache = {}


def fetch(path):
    if path in cache:
        return cache[path]
    try:
        with urllib.request.urlopen(base + path, timeout=15) as r:
            out = (r.status, {k.lower(): v for k, v in r.headers.items()}, r.read())
    except urllib.error.HTTPError as e:
        out = (e.code, {k.lower(): v for k, v in e.headers.items()}, e.read())
    cache[path] = out
    return out


def fail(msg):
    failures.append(msg)
    print("FAIL", msg)


# 1. headers
for path in ["/", "/about.html", "/assets/css/site-enhancements.css", "/does-not-exist"]:
    status, headers, _ = fetch(path)
    missing = [h for h in REQUIRED_HEADERS if h.lower() not in headers]
    if missing:
        fail(f"{path} ({status}) missing headers: {', '.join(missing)}")
    if path == "/does-not-exist" and status != 404:
        fail(f"/does-not-exist returned {status}, expected 404")

# 2. held pages
for path in MUST_NOT_SHIP:
    status, _, _ = fetch(path)
    if status != 404:
        fail(f"{path} returned {status}, expected 404")

# apex redirect (container only)
if check_apex:
    import http.client

    u = urllib.parse.urlparse(base)
    conn = http.client.HTTPConnection(u.hostname, u.port or 80, timeout=15)
    conn.request("GET", "/about.html?x=1", headers={"Host": "apgiframework.com"})
    r = conn.getresponse()
    loc = r.getheader("Location")
    if r.status != 301 or loc != "https://www.apgiframework.com/about.html?x=1":
        fail(f"apex Host returned {r.status} -> {loc}, expected 301 -> https://www.apgiframework.com/about.html?x=1")
    conn.close()

# 3 + 4. sitemap and link crawl
status, _, body = fetch("/sitemap.xml")
if status != 200:
    fail(f"/sitemap.xml returned {status}")
    pages = []
else:
    locs = re.findall(r"<loc>([^<]+)</loc>", body.decode())
    pages = [urllib.parse.urlparse(u).path or "/" for u in locs]
    loc_for = dict(zip(pages, locs))
    _, _, robots = fetch("/robots.txt")
    m = re.search(r"^Sitemap:\s*(\S+)", robots.decode(), re.M)
    if not m or urllib.parse.urlparse(m.group(1)).netloc != urllib.parse.urlparse(locs[0]).netloc:
        fail(f"robots.txt Sitemap ({m.group(1) if m else 'missing'}) does not use the sitemap host")
    for path in pages:
        if fetch(path)[0] != 200:
            fail(f"sitemap URL {path} returned {fetch(path)[0]}")

refs = 0
for page in pages + ["/sitemap.html", "/404.html"]:
    status, headers, body = fetch(page)
    if status != 200 or "html" not in headers.get("content-type", ""):
        continue
    text = body.decode("utf-8", "ignore")
    if page in loc_for:
        c = re.search(r'<link[^>]*rel="canonical"[^>]*href="([^"]+)"', text)
        if not c:
            fail(f"{page} has no canonical link")
        elif c.group(1) != loc_for[page]:
            fail(f"{page} canonical {c.group(1)} != sitemap {loc_for[page]}")
    for m in re.finditer(r'(?:href|src)="([^"]+)"', text):
        ref = m.group(1).split("#")[0].split("?")[0]
        if not ref or re.match(r"(https?:|mailto:|tel:|data:|javascript:|//|\$|\{|%)", ref):
            continue
        refs += 1
        target = urllib.parse.urljoin(page, ref)
        if fetch(target)[0] != 200:
            fail(f"{page} -> {ref} returned {fetch(target)[0]}")

if pages and refs == 0:
    fail("link crawl examined 0 internal references; the check did not run")

print(f"checked {len(cache)} URLs, {refs} internal references, {len(pages)} sitemap pages")
if failures:
    print(f"{len(failures)} failure(s)")
    sys.exit(1)
print("OK")
