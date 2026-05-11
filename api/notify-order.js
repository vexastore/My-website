export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { msgText } = req.body;
    console.log('[notify-order] Received order notification request');

    if (!msgText) {
      return res.status(400).json({ success: false, error: 'Missing message text' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('[notify-order] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars');
      return res.status(500).json({ success: false, error: 'Server misconfiguration — env vars missing' });
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    console.log('[notify-order] Sending to Telegram...');

    const tgRes = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: msgText, parse_mode: 'HTML' }),
    });

    const tgData = await tgRes.json();

    if (!tgRes.ok) {
      console.error('[notify-order] Telegram API error:', tgData);
      return res.status(502).json({ success: false, error: 'Telegram API error', details: tgData });
    }

    console.log('[notify-order] Sent successfully, message_id:', tgData.result?.message_id);
    return res.status(200).json({ success: true, messageId: tgData.result?.message_id });

  } catch (err) {
    console.error('[notify-order] Unexpected error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
