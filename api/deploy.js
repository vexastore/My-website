// POST /api/deploy — triggers a Vercel deploy hook to rebuild the site
// Setup: Vercel → Settings → Git → Deploy Hooks → create hook → copy URL
//        then add VERCEL_DEPLOY_HOOK as environment variable in Vercel

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const hookUrl = process.env.VERCEL_DEPLOY_HOOK;
  if (!hookUrl) {
    return res.status(500).json({
      error: 'VERCEL_DEPLOY_HOOK غير مضبوط. أضفه في Vercel → Settings → Environment Variables'
    });
  }

  try {
    const response = await fetch(hookUrl, { method: 'POST' });
    if (!response.ok) {
      return res.status(500).json({ error: 'فشل إرسال طلب النشر لـ Vercel' });
    }
    return res.status(200).json({ ok: true, message: 'تم إرسال أمر النشر بنجاح' });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
