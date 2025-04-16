const mongoose = require('mongoose');
const Batalha = require('../models/batalha');
const { definirIntervalo } = require('../utils/dateUtils');

// ✅ 1. Calcule a porcentagem de vitórias e derrotas utilizando a carta X
async function calcularTaxaCarta(carta, inicio, fim) {
  const filtro = {
    timestamp: definirIntervalo(inicio, fim),
    $or: [{ deckJogador: carta }, { deckOponente: carta }]
  };

  const batalhas = await Batalha.find(filtro);
  const total = batalhas.length;
  const vitorias = batalhas.filter(b => b.vencedor === b.jogadorTag).length;
  const derrotas = total - vitorias;

  return {
    carta,
    total,
    vitorias,
    derrotas,
    taxaVitoria: total ? ((vitorias / total) * 100).toFixed(2) : 0,
    taxaDerrota: total ? ((derrotas / total) * 100).toFixed(2) : 0
  };
}

// ✅ 2. Liste os decks completos que produziram mais de X% de vitórias
async function listarDecksVitoriosos(taxaMinima, inicio, fim) {
  const filtro = { timestamp: definirIntervalo(inicio, fim) };
  const batalhas = await Batalha.find(filtro);

  const deckStats = {};
  batalhas.forEach(b => {
    const key = b.deckJogador.join(',');
    if (!deckStats[key]) deckStats[key] = { vitorias: 0, total: 0 };
    deckStats[key].total++;
    if (b.vencedor === b.jogadorTag) deckStats[key].vitorias++;
  });

  return Object.entries(deckStats)
    .map(([deck, stats]) => ({
      deck: deck.split(','),
      taxaVitoria: ((stats.vitorias / stats.total) * 100).toFixed(2),
      partidas: stats.total
    }))
    .filter(d => d.taxaVitoria >= taxaMinima);
}

// ✅ 3. Calcule a quantidade de derrotas utilizando um combo de cartas
async function calcularDerrotasCombo(cartasCombo, inicio, fim) {
  const filtro = {
    timestamp: definirIntervalo(inicio, fim),
    deckJogador: { $all: cartasCombo }
  };

  const batalhas = await Batalha.find(filtro);
  const derrotas = batalhas.filter(b => b.vencedor !== b.jogadorTag).length;

  return { combo: cartasCombo, derrotas };
}

// ✅ 4. Calcule vitórias envolvendo carta X com condições específicas
async function calcularVitoriasEspeciais(carta, trofeusMenorQue, inicio, fim) {
  const filtro = {
    timestamp: definirIntervalo(inicio, fim),
    $or: [{ deckJogador: carta }, { deckOponente: carta }],
    duracaoSegundos: { $lt: 120 }, // Partida menor que 2 min
    torresOponente: { $gte: 2 } // Perdedor derrubou pelo menos 2 torres
  };

  const batalhas = await Batalha.find(filtro);
  const vitorias = batalhas.filter(
    b => b.vencedor === b.jogadorTag && b.trofeusJogador <= (b.trofeusOponente * (1 - trofeusMenorQue / 100))
  ).length;

  return { carta, vitorias };
}

// ✅ 5. Liste combos de tamanho N com mais de Y% de vitórias
async function listarCombosVitoriosos(tamanhoCombo, taxaMinima, inicio, fim) {
  const filtro = { timestamp: definirIntervalo(inicio, fim) };
  const batalhas = await Batalha.find(filtro);

  const combosStats = {};
  batalhas.forEach(b => {
    const deck = b.deckJogador;
    if (deck.length < tamanhoCombo) return;

    const combos = gerarCombinacoes(deck, tamanhoCombo);
    combos.forEach(combo => {
      const key = combo.join(',');
      if (!combosStats[key]) combosStats[key] = { vitorias: 0, total: 0 };
      combosStats[key].total++;
      if (b.vencedor === b.jogadorTag) combosStats[key].vitorias++;
    });
  });

  return Object.entries(combosStats)
    .map(([combo, stats]) => ({
      combo: combo.split(','),
      taxaVitoria: ((stats.vitorias / stats.total) * 100).toFixed(2),
      partidas: stats.total
    }))
    .filter(d => d.taxaVitoria >= taxaMinima);
}

module.exports = {
  calcularTaxaCarta,
  listarDecksVitoriosos,
  calcularDerrotasCombo,
  calcularVitoriasEspeciais,
  listarCombosVitoriosos
};
