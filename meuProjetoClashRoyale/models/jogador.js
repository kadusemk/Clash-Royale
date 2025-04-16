const mongoose = require('mongoose');

const jogadorSchema = new mongoose.Schema({
  tag: String,
  nickname: String,
  trofeus: Number,
  nivel: Number,
  bestTrofeus: Number,
  vitorias: Number,
  derrotas: Number,
  clã: String,
  deckFavorito: [String],
  atualizadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Jogador', jogadorSchema);
