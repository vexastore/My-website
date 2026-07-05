import { NextRequest, NextResponse } from 'next/server';

// Sends new-order notifications to Telegram. Bot token stays server-side only.
// Requires two Vercel env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

export async function POST(req: NextRequest) {
  try {
    const { msgText } = await req.json() as { msgText?: string };
    if (!msgText || typeof msgText !== 'string') {
      return NextResponse.json({ error: 'Missing msgText' }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: 'Telegram not configured: set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel project settings' },
        { status: 500 }
      );
    }

    const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const tgRes = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: msgText,
        parse_mode: 'HTML',
      }),
    });

    if (!tgRes.ok) {
      const errBody = await tgRes.text().catch(() => '');
      return NextResponse.json({ error: 'Telegram API error', details: errBody }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error sending Telegram notification' }, { status: 500 });
  }
}
