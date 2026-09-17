import { NextResponse } from 'next/server';

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) return NextResponse.json({ error: 'Store unavailable' }, { status: 503 });
  const url = `${base}/rest/v1/store_settings?id=eq.default&select=currency,delivery_fee,ordering_enabled,support_phone`;
  try {
    const response = await fetch(url, { headers: { apikey: key }, next: { revalidate: 60 } });
    if (!response.ok) throw new Error('Settings read failed');
    const settings = (await response.json())[0];
    if (!settings) throw new Error('Settings missing');
    return NextResponse.json(settings, { headers: { 'Cache-Control': 'public, s-maxage=60' } });
  } catch {
    return NextResponse.json({ error: 'Store unavailable' }, { status: 503 });
  }
}
