import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { isStorefrontReference, matchingOrderStatuses } from '@/src/utils/order-status';

export const runtime = 'nodejs';

type Receipt = { reference: string; phone: string };

function validReceipts(value: unknown): value is { orders: Receipt[] } {
  if (!value || typeof value !== 'object' || !('orders' in value)) return false;
  const orders = (value as { orders: unknown }).orders;
  return Array.isArray(orders) && orders.length > 0 && orders.length <= 20
    && orders.every((order) => !!order && typeof order === 'object'
      && isStorefrontReference(order.reference)
      && typeof order.phone === 'string' && order.phone.trim().length >= 5
      && order.phone.trim().length <= 40);
}

function allowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (origin === (process.env.NEXT_PUBLIC_SITE_URL || 'https://vexatoys.com')) return true;
  if (process.env.NODE_ENV === 'production' || !origin) return false;
  try {
    const url = new URL(origin);
    return url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
  } catch { return false; }
}

const privateResponse = (body: object, status: number) => NextResponse.json(body, {
  status, headers: { 'Cache-Control': 'no-store' },
});

export async function POST(request: NextRequest) {
  if (!allowedOrigin(request)) return privateResponse({ error: 'Invalid request origin' }, 403);
  if (Number(request.headers.get('content-length') || 0) > 4096) return privateResponse({ error: 'Request too large' }, 413);
  const text = await request.text();
  if (text.length > 4096) return privateResponse({ error: 'Request too large' }, 413);
  let body: unknown;
  try { body = JSON.parse(text); } catch { return privateResponse({ error: 'Invalid JSON' }, 400); }
  if (!validReceipts(body)) return privateResponse({ error: 'Invalid order lookup' }, 400);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) return privateResponse({ error: 'Status unavailable' }, 503);

  const requested = new Map(body.orders.map((order) => [order.reference, order.phone.trim()]));
  try {
    const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.from('orders')
      .select('reference,customer_phone,status')
      .in('reference', [...requested.keys()])
      .eq('source', 'storefront');
    if (error) return privateResponse({ error: 'Status unavailable' }, 503);
    return privateResponse({ orders: matchingOrderStatuses(data ?? [], requested) }, 200);
  } catch { return privateResponse({ error: 'Status unavailable' }, 503); }
}
