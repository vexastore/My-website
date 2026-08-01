// GET /api/test-telegram
// Diagnostic endpoint — confirms TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID are set
// and that the bot can actually reach your chat.
// Visit https://vexatoys.com/api/test-telegram in the browser to run it.

export default async function handler(req, res) {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      ok: false,
      error: 'Missing env vars — set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel project settings',
      has_token:   !!token,
      has_chat_id: !!chatId,
    });
  }

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          chat_id:    chatId,
          text:       '✅ Vexa Store — إشعار تجريبي: تيلغرام متصل وشغال',
          parse_mode: 'HTML',
        }),
      }
    );

    const data = await tgRes.json();
    return res.status(tgRes.ok ? 200 : 502).json({
      ok:               data.ok,
      telegram_response: data,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
