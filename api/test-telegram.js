export default async function handler(req, res) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      ok: false,
      error: 'Missing env vars',
      has_token: !!token,
      has_chat_id: !!chatId
    });
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const body = JSON.stringify({
      chat_id: chatId,
      text: '✅ Vexa Store Telegram test — ' + new Date().toISOString(),
      parse_mode: 'HTML'
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });

    const data = await response.json();

    return res.status(200).json({
      ok: data.ok,
      telegram_response: data,
      env_token_length: token.length,
      env_chat_id: chatId
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
