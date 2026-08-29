#!/usr/bin/env python3
"""
Pull the main product image URL off a vendor page.

    python3 vendor-image.py "<Product Name>" <url> [<fallback url> ...]

Tries each URL in turn and stops at the first that yields a plausible product
photograph, so calls can be written official-brand-site-first with a
distributor behind it.

Prints a line in the `Product Name ~~ URL` shape the pipeline reads, so output
can be appended straight to supplier.tsv. It records the URL rather than the
bytes — fetch-images.ts does the downloading, which keeps one place responsible
for provenance and for the "is this actually a photo" size check.
"""

import html
import json
import re
import sys
import urllib.request

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")


def get(url: str) -> str:
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def absolutise(src: str, page: str) -> str:
    if src.startswith("//"):
        return "https:" + src
    if src.startswith("/"):
        m = re.match(r"(https?://[^/]+)", page)
        return (m.group(1) if m else "") + src
    return src


def candidates(doc: str, page: str):
    """og:image first, then JSON-LD, then the largest declared <img>."""
    m = re.search(
        r'<meta[^>]+property=["\']og:image["\'][^>]*content=["\'](.*?)["\']', doc, re.I | re.S)
    if m:
        yield html.unescape(m.group(1))

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
                if "Product" in (t if isinstance(t, list) else [t]):
                    img = node.get("image")
                    if isinstance(img, list):
                        img = img[0] if img else None
                    if isinstance(img, dict):
                        img = img.get("url")
                    if img:
                        yield img
                stack.extend(v for v in node.values() if isinstance(v, (dict, list)))

    sized = []
    for tag in re.findall(r"<img[^>]+>", doc, re.I):
        src = re.search(r'(?:data-src|src)=["\'](.*?)["\']', tag, re.I)
        w = re.search(r'width=["\']?(\d+)', tag, re.I)
        if src and w and int(w.group(1)) >= 400:
            sized.append((int(w.group(1)), html.unescape(src.group(1))))
    for _, src in sorted(sized, reverse=True):
        yield src


def usable(url: str) -> bool:
    """A real photograph, not a sprite, logo, placeholder or tracking pixel."""
    if not re.match(r"https?://", url):
        return False
    if re.search(r"(logo|sprite|placeholder|icon|badge|blank|pixel)", url, re.I):
        return False
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=25) as r:
            if not r.headers.get_content_type().startswith("image/"):
                return False
            return len(r.read(60000)) > 8000
    except Exception:
        return False


def main() -> None:
    product, *urls = sys.argv[1:]
    for page in urls:
        try:
            doc = get(page)
        except Exception as e:
            print(f"# {page} — {type(e).__name__}", file=sys.stderr)
            continue
        for c in candidates(doc, page):
            c = absolutise(c.strip(), page)
            if usable(c):
                print(f"{product} ~~ {c}")
                return
        print(f"# {page} — no usable image", file=sys.stderr)
    print(f"# {product} — NOTHING FOUND", file=sys.stderr)
    sys.exit(1)


main()
