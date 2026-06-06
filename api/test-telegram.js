export default async function handler(req, res) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({
      ok: false,
      error: 'Missing env vars',
      hasToken: !!botToken,
      hasChatId: !!chatId
    });
  }

  try {
    // Test 1: check bot info
    const meRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const meData = await meRes.json();

    if (!meData.ok) {
      return res.status(200).json({
        ok: false,
        step: 'getMe',
        error: meData.description,
        errorCode: meData.error_code,
        hint: meData.error_code === 401
          ? 'TELEGRAM_BOT_TOKEN غلط أو انتهت صلاحيته — يجب تغييره في Vercel env vars'
          : 'خطأ في Telegram API'
      });
    }

    // Test 2: send test message
    const msgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '✅ اختبار Vexa Store — التيليغرام يعمل بشكل صحيح!',
        parse_mode: 'HTML'
      })
    });
    const msgData = await msgRes.json();

    if (!msgData.ok) {
      return res.status(200).json({
        ok: false,
        step: 'sendMessage',
        botName: meData.result?.username,
        error: msgData.description,
        errorCode: msgData.error_code,
        hint: msgData.error_code === 400
          ? 'TELEGRAM_CHAT_ID غلط — تحقق من رقم المجموعة أو القناة'
          : msgData.error_code === 403
          ? 'البوت تم طرده من المجموعة — أعده للمجموعة'
          : 'خطأ في إرسال الرسالة'
      });
    }

    return res.status(200).json({
      ok: true,
      botName: meData.result?.username,
      messageId: msgData.result?.message_id,
      message: 'تم إرسال رسالة اختبار إلى التيليغرام بنجاح!'
    });

  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
