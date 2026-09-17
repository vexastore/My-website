import { NextResponse } from 'next/server';
import { fetchAdviceArticles } from '@/lib/fetchArticles';

export async function GET() {
  try {
    const articles = await fetchAdviceArticles();
    return NextResponse.json(articles, { headers: { 'Cache-Control': 'public, s-maxage=300' } });
  } catch {
    return NextResponse.json({ error: 'Articles unavailable' }, { status: 503 });
  }
}
