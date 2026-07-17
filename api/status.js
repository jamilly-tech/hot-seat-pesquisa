import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const finalized = await kv.get('hotseat:finalized');
    res.status(200).json({
      finalized: finalized === '1' || finalized === 1 || finalized === true
    });
  } catch (e) {
    res.status(200).json({ finalized: false });
  }
}
