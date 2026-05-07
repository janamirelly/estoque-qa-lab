const { db } = require("../db/database");

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function obterDashboard(req, res) {
  try {
    const cards =
      (await get(`
        SELECT
          COUNT(DISTINCT id_produto) AS total_produtos,
          COUNT(DISTINCT id_variacao) AS total_variacoes,
          COALESCE(SUM(quantidade), 0) AS estoque_total,

          SUM(CASE WHEN status = 'DISPONIVEL' THEN 1 ELSE 0 END) AS itens_disponiveis,
          SUM(CASE WHEN status = 'ATENCAO' THEN 1 ELSE 0 END) AS itens_atencao,
          SUM(CASE WHEN status = 'CRITICO' THEN 1 ELSE 0 END) AS itens_criticos,
          SUM(CASE WHEN status = 'ESGOTADO' THEN 1 ELSE 0 END) AS itens_esgotados,

          MAX(atualizado_em) AS ultima_atualizacao
        FROM vw_estoque_detalhado
      `)) || {};

    const estoquePorProduto = await all(`
      SELECT
        id_produto,
        produto,
        total_variacoes,
        quantidade_total
      FROM vw_dashboard_estoque_por_produto
      ORDER BY produto
    `);

    const ultimasMovimentacoes = await all(`
      SELECT
        id_movimentacao,
        criado_em,
        tipo,
        quantidade,
        observacao,
        id_variacao,
        sku,
        cor,
        tamanho,
        id_produto,
        produto
      FROM vw_movimentacao_detalhada
      LIMIT 5
    `);

    return res.json({
      cards: {
        total_produtos: Number(cards.total_produtos || 0),
        total_variacoes: Number(cards.total_variacoes || 0),
        estoque_total: Number(cards.estoque_total || 0),
        itens_disponiveis: Number(cards.itens_disponiveis || 0),
        itens_atencao: Number(cards.itens_atencao || 0),
        itens_criticos: Number(cards.itens_criticos || 0),
        itens_esgotados: Number(cards.itens_esgotados || 0),
        ultima_atualizacao: cards.ultima_atualizacao || null,
      },
      estoque_por_produto: estoquePorProduto,
      ultimas_movimentacoes: ultimasMovimentacoes,
    });
  } catch (error) {
    console.error("[DASHBOARD] erro ao montar dashboard:", error.message);

    return res.status(500).json({
      erro: "Erro ao montar dashboard de estoque.",
    });
  }
}

module.exports = {
  obterDashboard,
};
