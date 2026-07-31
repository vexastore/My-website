import { NextResponse } from 'next/server';

/**
 * GET /api/test-telegram
 * Quick diagnostic — confirms TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID are set
 * and that the Telegram API accepts messages.
 *
 * Visit this URL in the browser after deploying to verify Telegram is wired up:
 *   https://vexatoys.com/api/test-telegram
 */
export async function GET() {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Missing environment variables',
        missing: [
          ...(!token  ? ['TELEGRAM_BOT_TOKEN']  : []),
          ...(!chatId ? ['TELEGRAM_CHAT_ID']     : []),
        ],
        fix: 'Go to Vercel → Project Settings → Environment Variables and add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID, then redeploy.',
      },
      { status: 500 }
    );
  }

  try {
    const url  = `https://api.telegram.org/bot${token}/sendMessage`;
    const body = JSON.stringify({
      chat_id: chatId,
      text: `✅ Vexa Store — اختبار إشعار تيلغرام\n${new Date().toLocaleString('ar-LB')}`,
      parse_mode: 'HTML',
    });

    const res  = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Telegram API rejected the request',
          telegram_error: data,
          hint: data.error_code === 401
            ? 'TELEGRAM_BOT_TOKEN is invalid — get a new one from @BotFather'
            : data.error_code === 400
            ? 'TELEGRAM_CHAT_ID is wrong — use @userinfobot to find the correct chat ID'
            : 'Check Telegram API error above',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Test notification sent successfully to Telegram ✅',
      telegram_message_id: data.result?.message_id,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'Network error reaching Telegram API', details: String(err) },
      { status: 500 }
    );
  }
}
