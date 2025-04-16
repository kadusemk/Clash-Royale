const axios = require('axios');
const Jogador = require('../models/jogador');
const Batalha = require('../models/batalha');
const { API_BASE, TOKEN } = require('../config/dotenv');
const { formatarData } = require('../utils/dateUtils');

// ✅ Função para buscar informações do jogador e salvar no MongoDB
async function buscarJogador(tag) {
  try {
    console.log(`🔍 Buscando dados do jogador ${tag}...`);
    const res = await axios.get(`${API_BASE}/players/%23${tag}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });

    if (!res.data || !res.data.tag) {
      throw new Error("❌ Jogador não encontrado!");
    }

    const jogadorInfo = {
      tag: res.data.tag.replace('#', ''),
      nickname: res.data.name,
      trofeus: res.data.trophies,
      nivel: res.data.expLevel,
      bestTrofeus: res.data.bestTrophies,
      vitorias: res.data.wins,
      derrotas: res.data.losses,
      clã: res.data.clan ? res.data.clan.name : "Sem Clã",
      deckFavorito: res.data.currentDeck.map(card => card.name),
      atualizadoEm: new Date()
    };

    await Jogador.findOneAndUpdate({ tag: jogadorInfo.tag }, jogadorInfo, { upsert: true });
    console.log(`✅ Jogador ${res.data.name} salvo no MongoDB!`);
    return jogadorInfo;
  } catch (err) {
    console.error("❌ Erro ao buscar jogador:", err.message);
    return null;
  }
}

// ✅ Função para buscar batalhas recentes do jogador e salvar no MongoDB
async function buscarBatalhas(tag) {
    try {
      console.log(`⚔️ Buscando batalhas recentes de ${tag}...`);
      const res = await axios.get(`${API_BASE}/players/%23${tag}/battlelog`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
  
      if (!res.data || res.data.length === 0) {
        throw new Error("❌ Nenhuma batalha encontrada!");
      }
  
      const batalhas = res.data.map(b => {
        const timestampValido = new Date(b.battleTime);
        const trofeusDepoisJogador = b.team[0].startingTrophies + (b.team[0].trophyChange || 0);
        const trofeusDepoisOponente = b.opponent[0].startingTrophies + ((b.team[0].trophyChange || 0) * -1);
  
        return {
          timestamp: isNaN(timestampValido.getTime()) ? new Date() : timestampValido, // 🕒 Corrige timestamp inválido
          jogadorTag: tag,
          jogadorDeck: b.team[0].cards.map(c => c.name),
          oponenteTag: b.opponent[0].tag.replace('#', ''),
          oponenteDeck: b.opponent[0].cards.map(c => c.name),
          torresJogador: b.team[0].crowns,
          torresOponente: b.opponent[0].crowns,
          vencedor: b.winner ? b.winner.replace('#', '') : "Empate",
          trofeusAntesJogador: b.team[0].startingTrophies,
          trofeusDepoisJogador: isNaN(trofeusDepoisJogador) ? b.team[0].startingTrophies : trofeusDepoisJogador, // ✅ Se for NaN, mantém os troféus originais
          trofeusAntesOponente: b.opponent[0].startingTrophies,
          trofeusDepoisOponente: isNaN(trofeusDepoisOponente) ? b.opponent[0].startingTrophies : trofeusDepoisOponente // ✅ Se for NaN, mantém os troféus originais
        };
      });
  
      await Batalha.insertMany(batalhas);
      console.log(`✅ ${batalhas.length} batalhas salvas no MongoDB!`);
      return batalhas;
    } catch (err) {
      console.error("❌ Erro ao buscar batalhas:", err.message);
      return [];
    }
  }
  

module.exports = { buscarJogador, buscarBatalhas };
