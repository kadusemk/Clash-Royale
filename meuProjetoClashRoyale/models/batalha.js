const mongoose = require('mongoose');

const batalhaSchema = new mongoose.Schema({
  timestamp: Date, // 🕒 Data da partida
  jogadorTag: String,
  jogadorDeck: [String], // 🛡️ Deck do jogador
  oponenteTag: String,
  oponenteDeck: [String], // ⚔️ Deck do oponente
  torresJogador: Number, // 🏰 Torres derrubadas pelo jogador
  torresOponente: Number, // 🏰 Torres derrubadas pelo oponente
  vencedor: String, // 🏆 TAG do vencedor
  trofeusAntesJogador: Number, // 🎖️ Troféus do jogador antes da partida
  trofeusDepoisJogador: Number, // 🎖️ Troféus do jogador após a partida
  trofeusAntesOponente: Number, // 🎖️ Troféus do oponente antes da partida
  trofeusDepoisOponente: Number, // 🎖️ Troféus do oponente após a partida
});

module.exports = mongoose.model('Batalha', batalhaSchema);
