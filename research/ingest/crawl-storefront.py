#!/usr/bin/env python3
"""
Crawl the shop's own Ecwid storefront and record, for every product page, the
real product name and its main image.

    python3 crawl-storefront.py            # writes ecwid-crawl.tsv

The earlier pass went through the browser because this machine's network was
filtering vape and tobacco hosts. It keyed on `og:title`, which on Ecwid is an
SEO string ("Flum UT Bar 50K Disposable Vape $36.99 — Puff Vegas") rather than
a product name, so a third of the harvest failed to match anything.

The page also carries JSON-LD, and `Product.name` there is the actual name the
POS pushed up. Matching on that instead removes the guesswork entirely.
"""

import concurrent.futures as cf
import html
import json
import os
import re
import sys
import time
import urllib.request

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")

# The site is the shop's own, but it sits behind a WAF that rate-limits: a
# 12-way run tripped it outright and even 4-way drew 429s on 62 of 222 pages.
# Two workers with a pause between requests gets a clean sweep, and the run is
# resumable, so a partial pass is never wasted work.
WORKERS = 2
DELAY = 0.7        # seconds between requests, per worker
BACKOFF_429 = 20   # the WAF wants a real pause, not a retry


def get(url: str, tries: int = 4) -> str:
    for attempt in range(tries):
        try:
            time.sleep(DELAY)
            req = urllib.request.Request(url, headers={
                "User-Agent": UA,
                "Accept": "text/html,application/xhtml+xml",
                "Accept-Language": "en-US,en;q=0.9",
            })
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == tries - 1:
                raise
            time.sleep(BACKOFF_429 * (attempt + 1))
        except Exception:
            if attempt == tries - 1:
                raise
            time.sleep(1.5 * (attempt + 1))
    return ""


def meta(doc: str, prop: str) -> str | None:
    m = re.search(
        rf'<meta[^>]+(?:property|name)=["\']{re.escape(prop)}["\'][^>]*>', doc, re.I)
    if not m:
        return None
    c = re.search(r'content=["\'](.*?)["\']', m.group(0), re.S)
    return html.unescape(c.group(1)).strip() if c else None


def ld_product(doc: str) -> dict | None:
    """First JSON-LD node of @type Product, wherever it is nested."""
    for block in re.findall(
            r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', doc, re.S | re.I):
        try:
            data = json.loads(block.strip())
        except Exception:
            continue
        stack = [data]
        while stack:
            node = stack.pop()
            if isinstance(node, list):
                stack.extend(node)
            elif isinstance(node, dict):
                t = node.get("@type")
                types = t if isinstance(t, list) else [t]
                if "Product" in types:
                    return node
                stack.extend(v for v in node.values()
                             if isinstance(v, (dict, list)))
    return None


def _host(u: str) -> str:
    m = re.match(r"https?://([^/]+)", u)
    return m.group(1).lower() if m else ""


def _image_candidates(ld: dict, doc: str):
    """Every plausible image URL on a product page, best first."""
    img = ld.get("image")
    if isinstance(img, list):
        img = img[0] if img else None
    if isinstance(img, dict):
        yield img.get("contentUrl")
        yield img.get("url")
    elif isinstance(img, str):
        yield img
    yield meta(doc, "og:image")
    if isinstance(img, dict):
        yield img.get("thumbnailUrl")


def scrape(url: str) -> dict:
    doc = get(url)
    ld = ld_product(doc) or {}

    # Ecwid's ImageObject carries BOTH `url` — which is the product *page* — and
    # `contentUrl`, the actual photograph. Reading `url` yields a 150KB HTML
    # document that will happily be saved as a .jpg, so prefer contentUrl and
    # keep a same-host check as a backstop for whatever else it puts there.
    image = None
    for cand in _image_candidates(ld, doc):
        if cand and _host(cand) != _host(url):
            image = cand
            break

    return {
        "url": url,
        "name": (ld.get("name") or "").strip() or None,
        "sku": (ld.get("sku") or "").strip() or None,
        "seo_title": meta(doc, "og:title"),
        "image": image,
    }


def main() -> None:
    urls = [u for u in open("all-urls.txt").read().split()
            if "/products/" in u and not u.rstrip("/").endswith("/products")]

    rows: list[dict] = []
    if os.path.exists("ecwid-crawl.json"):
        rows = [r for r in json.load(open("ecwid-crawl.json")) if r.get("image")]
        done = {r["url"] for r in rows}
        urls = [u for u in urls if u not in done]
        print(f"resuming: {len(rows)} already held", file=sys.stderr)
    print(f"{len(urls)} product pages to fetch", file=sys.stderr)

    failed: list[str] = []
    with cf.ThreadPoolExecutor(WORKERS) as pool:
        futures = {pool.submit(scrape, u): u for u in urls}
        for i, fut in enumerate(cf.as_completed(futures), 1):
            try:
                rows.append(fut.result())
            except Exception as e:
                failed.append(f"{futures[fut]} — {e}")
            if i % 25 == 0:
                print(f"  {i}/{len(urls)}", file=sys.stderr)

    with open("ecwid-crawl.tsv", "w") as f:
        for r in sorted(rows, key=lambda r: r["url"]):
            if r["name"] and r["image"]:
                f.write(f"{r['name']} ~~ {r['image']}\n")

    with open("ecwid-crawl.json", "w") as f:
        json.dump(sorted(rows, key=lambda r: r["url"]), f, indent=1)

    named = sum(1 for r in rows if r["name"])
    imaged = sum(1 for r in rows if r["image"])
    print(f"\nscraped     {len(rows)}", file=sys.stderr)
    print(f"ld name     {named}", file=sys.stderr)
    print(f"image       {imaged}", file=sys.stderr)
    print(f"failed      {len(failed)}", file=sys.stderr)
    for x in failed[:8]:
        print(f"  ! {x}", file=sys.stderr)


main()
