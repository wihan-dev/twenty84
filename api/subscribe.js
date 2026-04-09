import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, phone } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`INSERT INTO subscribers (email, phone) VALUES (${email}, ${phone || null}) ON CONFLICT (email) DO UPDATE SET phone = COALESCE(EXCLUDED.phone, subscribers.phone)`;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
