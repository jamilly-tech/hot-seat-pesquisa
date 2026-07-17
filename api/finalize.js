import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }
  try {
    const { password, action } = req.body || {};
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    if (action === 'finalize') {
      await kv.set('hotseat:finalized', '1');
    } else if (action === 'reopen') {
      await kv.set('hotseat:finalized', '0');
    } else if (action === 'reset') {
      await kv.del('hotseat:ratings');
      await kv.del('hotseat:names');
      await kv.set('hotseat:finalized', '0');
    } else {
      return res.status(400).json({ error: 'invalid action' });
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'server error' });
  }
}
