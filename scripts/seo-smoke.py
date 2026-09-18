#!/usr/bin/env python3
"""Audit a local production server's canonical sitemap and representative SEO HTML."""
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from urllib.request import Request, urlopen
import json
import sys
import xml.etree.ElementTree as ET

BASE = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3000').rstrip('/')
CANONICAL = 'https://vexatoys.com'


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.lang = self.direction = None
        self.titles = []
        self.descriptions = []
        self.canonicals = []
        self.robots = []
        self.h1_count = 0
        self.schemas = []
        self.capture = None
        self.buffer = ''

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'html':
            self.lang, self.direction = attrs.get('lang'), attrs.get('dir')
        elif tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonicals.append(attrs.get('href'))
        elif tag == 'meta' and attrs.get('name') == 'description':
            self.descriptions.append(attrs.get('content'))
        elif tag == 'meta' and attrs.get('name') == 'robots':
            self.robots.append(attrs.get('content', ''))
        elif tag == 'h1':
            self.h1_count += 1
        elif tag == 'title' or tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.capture = tag
            self.buffer = ''

    def handle_data(self, data):
        if self.capture:
            self.buffer += data

    def handle_endtag(self, tag):
        if tag == self.capture:
            if tag == 'title':
                self.titles.append(self.buffer)
            elif tag == 'script':
                self.schemas.append(json.loads(self.buffer))
            self.capture = None
            self.buffer = ''


def fetch(path, locale='en'):
    request = Request(BASE + path, headers={'Cookie': f'vexa_store_language={locale}'})
    with urlopen(request, timeout=30) as response:
        body = response.read().decode('utf-8')
        status = response.status
    page = Page()
    page.feed(body)
    return status, page


def main():
    with urlopen(BASE + '/sitemap.xml', timeout=30) as response:
        sitemap = ET.fromstring(response.read())
    namespace = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = [element.text for element in sitemap.findall('.//s:loc', namespace)]
    assert urls and len(urls) == len(set(urls)), 'Sitemap has no URLs or duplicates'
    paths = [url.removeprefix(CANONICAL) or '/' for url in urls]
    assert all(url.startswith(CANONICAL + '/') or url == CANONICAL for url in urls)
    assert any('/blog/guides/' in path for path in paths), 'Published articles missing'
    assert any('/sex-toys/' in path for path in paths), 'Products missing'

    errors = []
    titles = defaultdict(list)
    descriptions = defaultdict(list)
    with ThreadPoolExecutor(max_workers=8) as pool:
        rows = list(pool.map(fetch, paths))
    for path, (status, page) in zip(paths, rows):
        expected = CANONICAL + ('' if path == '/' else path)
        if status != 200 or page.canonicals != [expected] or len(page.titles) != 1 or len(page.descriptions) != 1 or page.h1_count != 1:
            errors.append(f'{path}: {status}, canonical={page.canonicals}, titles={len(page.titles)}, descriptions={len(page.descriptions)}, h1={page.h1_count}')
        else:
            titles[page.titles[0]].append(path)
            descriptions[page.descriptions[0]].append(path)
    for label, values in [('title', titles), ('description', descriptions)]:
        for text, duplicate_paths in values.items():
            if text and len(duplicate_paths) > 1:
                errors.append(f'duplicate {label}: {duplicate_paths}')

    samples = ['/', '/sex-toys', '/blog', '/blog/guides', '/about', '/quiz',
               next(path for path in paths if '/blog/guides/' in path),
               next(path for path in paths if path.count('/') == 2 and not path.startswith('/blog/'))]
    for path in samples:
        for locale, direction in [('en', 'ltr'), ('ar', 'rtl')]:
            status, page = fetch(path, locale)
            if status != 200 or page.lang != locale or page.direction != direction or page.canonicals != [CANONICAL + ('' if path == '/' else path)]:
                errors.append(f'{path} {locale}: status/lang/dir/canonical mismatch')
    _, checkout = fetch('/checkout')
    if not any('noindex' in value for value in checkout.robots):
        errors.append('/checkout missing noindex')
    with urlopen(BASE + '/robots.txt', timeout=30) as response:
        robots = response.read().decode('utf-8')
    if 'Sitemap: https://vexatoys.com/sitemap.xml' not in robots or 'Disallow: /checkout' in robots:
        errors.append('robots.txt sitemap or checkout rule incorrect')
    print(f'{len(urls)} unique sitemap URLs, {len(samples) * 2} locale checks, {len(errors)} errors')
    for error in errors[:30]:
        print(error)
    return 1 if errors else 0


if __name__ == '__main__':
    sys.exit(main())
