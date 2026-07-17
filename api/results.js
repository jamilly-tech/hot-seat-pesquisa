const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  try {
    const ratings = (await kv.hgetall('hotseat:ratings')) || {};
    const names = (await kv.hgetall('hotseat:names')) || {};
    res.status(200).json({ ratings, names });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno', details: String(err && err.message || err) });
  }
};
