import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Customer = { name: string; phone: string; countryCode?: string; city: string; address: string; notes?: string };
type Item = { productId: string; quantity: number; selectedOptions?: Record<string, string> };
type Payload = { idempotencyKey: string; customer: Customer; items: Item[]; locale: 'en' | 'ar' };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validText(value: unknown, min: number, max: number): value is string {
  return typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;
}

function validPayload(value: unknown): value is Payload {
  if (!value || typeof value !== 'object') return false;
  const body = value as Partial<Payload>;
  const customer = body.customer;
  return typeof body.idempotencyKey === 'string' && uuid.test(body.idempotencyKey)
    && (body.locale === 'en' || body.locale === 'ar')
    && !!customer && validText(customer.name, 2, 120)
    && validText(customer.phone, 5, 40) && validText(customer.city, 1, 120)
    && validText(customer.address, 4, 500)
    && (customer.notes === undefined || validText(customer.notes, 0, 2000))
    && Array.isArray(body.items) && body.items.length >= 1 && body.items.length <= 50
    && body.items.every(item => typeof item.productId === 'string' && uuid.test(item.productId)
      && Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 99
      && (!item.selectedOptions || (typeof item.selectedOptions === 'object'
        && Object.keys(item.selectedOptions).length <= 20
        && Object.entries(item.selectedOptions).every(([key, option]) => validText(key, 1, 100) && validText(option, 1, 200)))));
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const expected = process.env.NEXT_PUBLIC_SITE_URL || 'https://vexatoys.com';
  if (origin === expected) return true;
  if (process.env.NODE_ENV === 'production' || !origin) return false;
  try {
    const localOrigin = new URL(origin);
    return localOrigin.protocol === 'http:'
      && (localOrigin.hostname === 'localhost' || localOrigin.hostname === '127.0.0.1');
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  if (Number(request.headers.get('content-length') || 0) > 16_384) return NextResponse.json({ error: 'Request too large' }, { status: 413 });
  const text = await request.text();
  if (text.length > 16_384) return NextResponse.json({ error: 'Request too large' }, { status: 413 });
  let body: unknown;
  try { body = JSON.parse(text); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!validPayload(body)) return NextResponse.json({ error: 'Invalid order details' }, { status: 400 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) return NextResponse.json({ error: 'Checkout unavailable' }, { status: 503 });
  try {
    const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.rpc('create_order', {
      p_idempotency_key: body.idempotencyKey,
      p_customer: {
        name: body.customer.name.trim(), phone: body.customer.phone.trim(),
        country_code: body.customer.countryCode?.trim() || null,
        city: body.customer.city.trim(), address: body.customer.address.trim(),
        notes: body.customer.notes?.trim() || null,
      },
      p_items: body.items.map(item => ({ product_id: item.productId, quantity: item.quantity, selected_options: item.selectedOptions || {} })),
      p_locale: body.locale,
      p_source: 'storefront',
    });
    if (error || !data?.[0]) {
      const invalid = error?.code === '22023' || error?.code === '23514' || error?.code === 'P0002';
      return NextResponse.json({ error: invalid ? 'An item or customer detail is invalid or unavailable' : 'Could not save order' }, { status: invalid ? 409 : 503 });
    }
    const order = data[0];
    return NextResponse.json({ id: order.order_id, reference: order.order_reference, status: order.order_status, total: Number(order.order_total),
      testMode: process.env.NODE_ENV !== 'production' && process.env.LOCAL_CHECKOUT_MOCK === 'true'
        && ['localhost', '127.0.0.1'].includes(new URL(url).hostname) }, {
      status: 201, headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Checkout unavailable' }, { status: 503 });
  }
}
