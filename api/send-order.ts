const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('[send-order] Missing env vars');
    return res.status(500).json({
      error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID',
    });
  }

  const order = req.body;

  if (!order) {
    console.error('[send-order] Empty body');
    return res.status(400).json({ error: 'No order data' });
  }

  console.log('[send-order] Order received:', order);

  const text = `
🛒 *طلب جديد - Vexastore*

🆔 رقم الطلب: ${order.orderId || 'N/A'}
📅 التاريخ: ${order.date || 'N/A'}

👤 الاسم: ${order.customerName || 'N/A'}
📞 الهاتف: ${order.customerPhone || 'N/A'}
🏙️ المدينة: ${order.customerCity || 'N/A'}
📍 العنوان: ${order.customerAddress || 'N/A'}
📝 ملاحظات: ${order.customerNotes || '—'}

📦 المنتجات:
${Array.isArray(order.products) ? order.products.join('\n') : order.products || 'N/A'}

💵 السعر: ${order.subtotalPrice || 'N/A'}
🚚 التوصيل: $5.00
💰 المجموع: ${order.totalPrice || 'N/A'}
`;

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: 'Markdown',
        }),
      }
    );

    const data = await tgRes.json();

    console.log('[send-order] Telegram response:', data);

    if (!data.ok) {
      return res.status(500).json({
        error: 'Telegram error',
        detail: data,
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[send-order] Failed:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
