const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/dotenv');

async function conectarMongoDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🟢 MongoDB conectado');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = { conectarMongoDB };
