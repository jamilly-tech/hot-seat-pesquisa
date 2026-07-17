import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const password = (req.body && req.body.password) || req.query.password;
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const ratings = (await kv.hgetall('hotseat:ratings')) || {};
    const names = (await kv.hgetall('hotseat:names')) || {};
    const finalized = await kv.get('hotseat:finalized');

    res.status(200).json({
      ratings,
      names,
      finalized: finalized === '1' || finalized === 1 || finalized === true
    });
  } catch (e) {
    res.status(500).json({ error: 'server error' });
  }
}
