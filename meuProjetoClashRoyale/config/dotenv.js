require('dotenv').config();

if (!process.env.MONGO_URI || !process.env.API_TOKEN) {
  throw new Error("❌ Variáveis de ambiente MONGO_URI ou API_TOKEN não definidas!");
}

module.exports = {
  API_BASE: 'https://api.clashroyale.com/v1',
  MONGO_URI: process.env.MONGO_URI,
  TOKEN: process.env.API_TOKEN
};
