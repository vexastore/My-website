import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { fetchApprovedProductReviews } from '@/lib/productReviews';

export const runtime = 'nodejs';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const expected = process.env.NEXT_PUBLIC_SITE_URL || 'https://vexatoys.com';
  if (origin === expected) return true;
  if (process.env.NODE_ENV === 'production' || !origin) return false;
  try {
    const localOrigin = new URL(origin);
    return (
      localOrigin.protocol === 'http:' &&
      (localOrigin.hostname === 'localhost' || localOrigin.hostname === '127.0.0.1')
    );
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId || !uuidRegex.test(productId)) {
    return NextResponse.json({ error: 'Valid productId is required' }, { status: 400 });
  }

  try {
    const reviews = await fetchApprovedProductReviews(productId);
    return NextResponse.json({ reviews });
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 8192) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 });
  }

  let body: {
    productId?: string;
    customerName?: string;
    rating?: number;
    title?: string;
    body?: string;
    locale?: string;
    orderReference?: string;
    customerPhone?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { productId, customerName, rating, title, body: reviewText, locale, orderReference, customerPhone } = body;

  if (!productId || typeof productId !== 'string' || !uuidRegex.test(productId)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  const cleanName = (customerName ?? '').trim();
  if (cleanName.length < 2 || cleanName.length > 100) {
    return NextResponse.json({ error: 'Name must be between 2 and 100 characters' }, { status: 400 });
  }

  const numRating = Number(rating);
  if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
    return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
  }

  const cleanBody = (reviewText ?? '').trim();
  if (cleanBody.length < 5 || cleanBody.length > 2000) {
    return NextResponse.json({ error: 'Review body must be between 5 and 2000 characters' }, { status: 400 });
  }

  const cleanTitle = title ? title.trim().slice(0, 150) : null;
  const cleanLocale = locale === 'ar' ? 'ar' : 'en';
  const cleanOrderRef = orderReference ? orderReference.trim().toUpperCase().slice(0, 50) : null;
  const cleanPhone = customerPhone ? customerPhone.trim().slice(0, 40) : null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Review service unavailable' }, { status: 503 });
  }

  try {
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase.rpc('submit_product_review', {
      p_product_id: productId,
      p_customer_name: cleanName,
      p_rating: numRating,
      p_body: cleanBody,
      p_title: cleanTitle,
      p_locale: cleanLocale,
      p_order_reference: cleanOrderRef,
      p_customer_phone: cleanPhone,
    });

    if (error) {
      console.error('RPC submit_product_review error:', error);
      return NextResponse.json({ error: 'Unable to submit review' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      reviewId: data,
      message: 'Review submitted successfully. It will appear once approved by an administrator.',
    });
  } catch (err) {
    console.error('Review submission error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
