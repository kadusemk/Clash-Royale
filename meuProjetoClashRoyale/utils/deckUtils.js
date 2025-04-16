// ✅ Calcular a taxa de vitória de um deck
function calcularTaxaVitoria(vitorias, total) {
    if (total === 0) return 0;
    return ((vitorias / total) * 100).toFixed(2);
  }
  
  // ✅ Gerar combinações possíveis de cartas dentro do deck
  function gerarCombinacoes(deck, tamanho) {
    if (tamanho === 1) return deck.map(carta => [carta]);
  
    const resultado = [];
    for (let i = 0; i <= deck.length - tamanho; i++) {
      const head = deck[i];
      const tailCombos = gerarCombinacoes(deck.slice(i + 1), tamanho - 1);
      for (const tail of tailCombos) {
        resultado.push([head, ...tail]);
      }
    }
  
    return resultado;
  }
  
  // ✅ Processar estatísticas de decks e identificar os melhores e piores
  function analisarDecks(batalhas) {
    const deckStats = {};
  
    batalhas.forEach(b => {
      const deckKey = b.deckJogador.join(',');
      if (!deckStats[deckKey]) deckStats[deckKey] = { vitorias: 0, total: 0 };
      deckStats[deckKey].total++;
      if (b.vencedor === b.jogadorTag) deckStats[deckKey].vitorias++;
    });
  
    const decksOrdenados = Object.entries(deckStats)
      .map(([deck, stats]) => ({
        deck,
        taxaVitoria: calcularTaxaVitoria(stats.vitorias, stats.total),
        partidas: stats.total
      }))
      .sort((a, b) => b.taxaVitoria - a.taxaVitoria);
  
    return {
      melhorDeck: decksOrdenados[0],
      piorDeck: decksOrdenados[decksOrdenados.length - 1]
    };
  }
  
  module.exports = { calcularTaxaVitoria, gerarCombinacoes, analisarDecks };
  