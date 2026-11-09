import React from 'react';
import { slugifyHeading } from '@/lib/blogContent';

/**
 * Renders article Markdown (headings, paragraphs, bold, italic, code, links,
 * images, lists, tables, quotes, rules) into styled HTML. Server-safe, no
 * client JavaScript. Links are real anchors; external ones open in a new tab.
 */

function inline(text: string, keyPrefix: string): React.ReactNode[] {
  const tokens = text.split(/(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean);
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    const image = token.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      return (
        <img key={key} src={image[2]} alt={image[1]} loading="lazy" decoding="async" className="my-6 w-full rounded-2xl border border-white/10" />
      );
    }
    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2].trim();
      const external = /^https?:\/\//i.test(href) && !href.startsWith('https://vexatoys.com');
      return (
        <a
          key={key}
          href={href}
          className="vexa-link"
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {link[1]}
        </a>
      );
    }
    if (token.startsWith('**') && token.endsWith('**')) return <strong key={key} className="font-bold text-white">{token.slice(2, -2)}</strong>;
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) return <em key={key}>{token.slice(1, -1)}</em>;
    if (token.startsWith('`') && token.endsWith('`')) return <code key={key} className="rounded bg-white/10 px-1.5 py-0.5 text-[0.85em] text-vexa-pink">{token.slice(1, -1)}</code>;
    return <React.Fragment key={key}>{token}</React.Fragment>;
  });
}

export function ArticleBody({ markdown }: { markdown: string }) {
  const lines = markdown.trim().split('\n');
  const nodes: React.ReactNode[] = [];
  const headingCounts = new Map<string, number>();
  let i = 0;

  const headingId = (text: string) => {
    const base = slugifyHeading(text);
    const count = headingCounts.get(base) || 0;
    headingCounts.set(base, count + 1);
    return count ? `${base}-${count + 1}` : base;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    if (/^---+$/.test(line.trim())) {
      nodes.push(<hr key={`hr-${i}`} className="my-10 border-white/10" />);
      i++; continue;
    }

    if (line.startsWith('## ')) {
      const text = line.slice(3).trim();
      nodes.push(
        <h2 key={`h2-${i}`} id={headingId(text)} className="mt-12 scroll-mt-28 text-2xl font-black tracking-tight text-white sm:text-3xl">
          {inline(text, `h2-${i}`)}
        </h2>
      );
      i++; continue;
    }

    if (line.startsWith('### ')) {
      nodes.push(
        <h3 key={`h3-${i}`} className="mt-8 text-lg font-bold text-white sm:text-xl">
          {inline(line.slice(4).trim(), `h3-${i}`)}
        </h3>
      );
      i++; continue;
    }

    if (line.startsWith('#### ')) {
      nodes.push(<h4 key={`h4-${i}`} className="mt-6 text-base font-bold text-stone-100">{inline(line.slice(5).trim(), `h4-${i}`)}</h4>);
      i++; continue;
    }

    if (line.startsWith('> ')) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) { quote.push(lines[i].slice(2)); i++; }
      nodes.push(
        <blockquote key={`q-${i}`} className="my-6 border-s-4 border-vexa-pink/60 bg-vexa-surface px-5 py-4 text-base leading-7 text-stone-200">
          {inline(quote.join(' '), `q-${i}`)}
        </blockquote>
      );
      continue;
    }

    if (line.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        if (lines[i].replace(/[|\-:\s]/g, '') !== '') rows.push(lines[i].split('|').slice(1, -1).map(cell => cell.trim()));
        i++;
      }
      if (rows.length) {
        nodes.push(
          <div key={`table-${i}`} className="my-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-vexa-raised">
                  {rows[0].map((cell, ci) => <th key={ci} className="px-4 py-3 text-start font-bold text-white">{inline(cell, `th-${i}-${ci}`)}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, ri) => (
                  <tr key={ri} className="border-t border-white/10">
                    {row.map((cell, ci) => <td key={ci} className="px-4 py-3 text-stone-300">{inline(cell, `td-${i}-${ri}-${ci}`)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) { items.push(lines[i].slice(2)); i++; }
      nodes.push(
        <ul key={`ul-${i}`} className="my-5 space-y-2 ps-1">
          {items.map((item, li) => (
            <li key={li} className="flex gap-3 text-base leading-7 text-stone-300">
              <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-vexa-pink" />
              <span>{inline(item, `li-${i}-${li}`)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\. /, '')); i++; }
      nodes.push(
        <ol key={`ol-${i}`} className="my-5 space-y-2">
          {items.map((item, li) => (
            <li key={li} className="flex gap-3 text-base leading-7 text-stone-300">
              <span className="w-6 shrink-0 font-black text-vexa-pink">{li + 1}.</span>
              <span>{inline(item, `oli-${i}-${li}`)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph: merge consecutive non-empty, non-block lines.
    const para: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#{2,4} |[-*] |\d+\. |\||> |---)/.test(lines[i])) { para.push(lines[i]); i++; }
    nodes.push(
      <p key={`p-${i}`} className="my-5 text-base leading-8 text-stone-300">
        {inline(para.join(' '), `p-${i}`)}
      </p>
    );
  }

  return <div className="article-body">{nodes}</div>;
}
