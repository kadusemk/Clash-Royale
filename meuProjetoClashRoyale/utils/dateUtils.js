const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

// ✅ Converter timestamp da API para um objeto Date
function formatarData(battleTimeRaw) {
  return dayjs.utc(battleTimeRaw, 'YYYYMMDDTHHmmss').toDate();
}

// ✅ Definir intervalo de tempo para consultas no MongoDB
function definirIntervalo(inicio, fim) {
  return {
    $gte: dayjs(inicio).startOf('day').toDate(),
    $lte: dayjs(fim).endOf('day').toDate()
  };
}

// ✅ Retorna uma string formatada para exibição de datas
function formatarDataExibicao(data) {
  return dayjs(data).format('DD/MM/YYYY HH:mm:ss');
}

module.exports = { formatarData, definirIntervalo, formatarDataExibicao };
