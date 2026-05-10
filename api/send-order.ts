const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = '8790079700';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Verify env var is present
  if (!BOT_TOKEN) {
    console.error('[send-order] TELEGRAM_BOT_TOKEN is not set in environment variables');
    return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN not configured on server' });
  }

  const order = req.body;
  if (!order || !order.orderId) {
    console.error('[send-order] Missing or invalid order body:', req.body);
    return res.status(400).json({ error: 'No order data' });
  }

  console.log('[send-order] Processing order:', order.orderId);

  const lines = [
    '🛒 <b>طلب جديد - Vexastore!</b>',
    '',
    `🆔 <b>رقم الطلب:</b> ${order.orderId}`,
    `📅 <b>التاريخ:</b> ${order.date}`,
    '',
    `👤 <b>الاسم:</b> ${order.customerName}`,
    `📞 <b>الهاتف:</b> ${order.customerPhone}`,
    `🏙️ <b>المدينة:</b> ${order.customerCity}`,
    `📍 <b>العنوان:</b> ${order.customerAddress}`,
    `📝 <b>ملاحظات:</b> ${order.customerNotes || '—'}`,
    '',
    '📦 <b>المنتجات:</b>',
    order.products,
    '',
    `💵 <b>سعر المنتجات:</b> ${order.subtotalPrice}`,
    `🚚 <b>رسوم التوصيل:</b> $5.00 USD`,
    `💰 <b>المجموع الكلي:</b> ${order.totalPrice}`,
    `📊 <b>الحالة:</b> ${order.status}`,
  ];

  const text = lines.join('\n');
  const tgUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const tgRes = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
    });

    const tgData = await tgRes.json() as { ok: boolean; description?: string; error_code?: number };
    console.log('[send-order] Telegram response:', JSON.stringify(tgData));

    if (!tgData.ok) {
      console.error('[send-order] Telegram API error:', tgData.description, 'code:', tgData.error_code);
      return res.status(500).json({ error: 'Telegram rejected the message', detail: tgData });
    }

    console.log('[send-order] ✅ Notification sent for order:', order.orderId);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[send-order] fetch to Telegram failed:', err);
    return res.status(500).json({ error: 'Network error reaching Telegram API' });
  }
}
