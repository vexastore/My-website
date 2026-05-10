
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8695367603:AAH3zD1_OprIfIxl0MVUX9K9w4YIR2U6lA8';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8790079700';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const order = req.body;
  if (!order) return res.status(400).json({ error: 'No order data' });

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

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
    });
    const tgData = await tgRes.json() as { ok: boolean };
    if (!tgData.ok) return res.status(500).json({ error: 'Telegram error', detail: tgData });
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Failed to send to Telegram' });
  }
}
