const axios = require('axios');

let cachedData = null;
let lastFetch = 0;
const CACHE_DURATION = 60000;

module.exports = async function handler(req, res) {
  const now = Date.now();

  if (!cachedData || now - lastFetch > CACHE_DURATION) {
    try {
      const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple&vs_currencies=usd";
      const response = await axios.get(url);
      cachedData = response.data;
      lastFetch = now;
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar dados" });
    }
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  res.status(200).json({
    prices: cachedData,
    updatedAt: new Date(lastFetch).toISOString(),
  });
};
