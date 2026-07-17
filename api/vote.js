import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }
  try {
    const finalized = await kv.get('hotseat:finalized');
    if (finalized === '1' || finalized === 1 || finalized === true) {
      return res.status(403).json({ error: 'closed' });
    }

    const { rating, name } = req.body || {};
    const r = parseInt(rating, 10);
    if (isNaN(r) || r < 0 || r > 10) {
      return res.status(400).json({ error: 'invalid rating' });
    }
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'invalid name' });
    }

    await kv.hincrby('hotseat:ratings', String(r), 1);
    await kv.hincrby('hotseat:names', name.trim(), 1);

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'server error' });
  }
}
