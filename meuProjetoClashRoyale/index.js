const readline = require('readline');
const mongoose = require('mongoose');
const { conectarMongoDB } = require('./services/db');
const { buscarJogador, buscarBatalhas } = require('./services/api');
const { formatarData } = require('./utils/dateUtils');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  await conectarMongoDB();

  rl.question('Digite a TAG do jogador (sem #): ', async (tag) => {
    const jogador = await buscarJogador(tag);
    const batalhas = await buscarBatalhas(tag);

    if (jogador) {
      console.log(`🎯 Informações do jogador ${jogador.nickname} (Tag: ${jogador.tag})`);
      console.log(`🏆 Troféus: ${jogador.trofeus}`);
      console.log(`🎖️ Vitórias: ${jogador.vitorias}`);
      console.log(`🔥 Derrotas: ${jogador.derrotas}`);
      console.log(`⚔️ Deck favorito: ${jogador.deckFavorito.join(', ')}`);
    }

    if (batalhas.length > 0) {
      console.log("\n📜 Últimas batalhas:");
      batalhas.forEach(b => {
        console.log(`🕒 ${formatarData(b.timestamp)}`);
        console.log(`🛡️ Deck jogador: ${b.jogadorDeck.join(', ')}`);
        console.log(`⚔️ Deck oponente: ${b.oponenteDeck.join(', ')}`);
        console.log(`🏰 Torres jogador: ${b.torresJogador} | Torres oponente: ${b.torresOponente}`);
        console.log(`🏆 Vencedor: ${b.vencedor}`);
        console.log(`🎖️ Troféus antes/depois jogador: ${b.trofeusAntesJogador} → ${b.trofeusDepoisJogador}`);
        console.log(`🎖️ Troféus antes/depois oponente: ${b.trofeusAntesOponente} → ${b.trofeusDepoisOponente}`);
        console.log('--------------------------------');
      });
    }

    mongoose.disconnect();
    rl.close();
  });
}

main();
