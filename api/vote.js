const { kv } = require('@vercel/kv');

const NAMES = ["Ananda","Cauã","Hellen","João Vitor","Karla","Manu","Renam","Rodrigo (o Karam)","Serefim"];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    const rating = Number(body && body.rating);
    const name = (body && body.name ? String(body.name) : '').trim().slice(0, 60);

    if (!Number.isInteger(rating) || rating < 0 || rating > 10) {
      res.status(400).json({ error: 'Nota inválida' });
      return;
    }
    if (!name) {
      res.status(400).json({ error: 'Nome inválido' });
      return;
    }

    await kv.hincrby('hotseat:ratings', String(rating), 1);
    await kv.hincrby('hotseat:names', name, 1);

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno', details: String(err && err.message || err) });
  }
};
