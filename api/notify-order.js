// POST /api/notify-order
// Sends new-order Telegram notifications from the server side.
// Token is never exposed to the browser.
//
// Body: { msgText: string }
// Requires Vercel env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { msgText } = req.body || {};
  if (!msgText || typeof msgText !== 'string') {
    return res.status(400).json({ error: 'Missing msgText in request body' });
  }

  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('[notify-order] Missing env vars: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    return res.status(500).json({
      error: 'Telegram not configured',
      has_token: !!token,
      has_chat_id: !!chatId,
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 10000);

    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ chat_id: chatId, text: msgText, parse_mode: 'HTML' }),
        signal:  controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!tgRes.ok) {
      const details = await tgRes.text().catch(() => '');
      console.error('[notify-order] Telegram API error:', tgRes.status, details);
      return res.status(502).json({ error: 'Telegram API error', status: tgRes.status, details });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    console.error('[notify-order] error:', err.message);
    return res.status(isTimeout ? 504 : 500).json({
      error: isTimeout ? 'Telegram request timed out' : err.message,
    });
  }
}
