const { db } = require("../db/database");

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

async function listarEstoque(req, res) {
  try {
    const estoque = await all(`
      SELECT
        id_produto,
        produto,
        descricao,
        produto_ativo,
        id_variacao,
        cor,
        tamanho,
        sku,
        preco,
        variacao_ativa,
        quantidade,
        estoque_min,
        atualizado_em,
        status
      FROM vw_estoque_detalhado
      ORDER BY produto, cor, tamanho
    `);

    return res.json(estoque);
  } catch (error) {
    console.error("[ESTOQUE] erro ao listar:", error.message);

    return res.status(500).json({
      erro: "Erro ao listar estoque.",
    });
  }
}

async function listarAlertasEstoque(req, res) {
  try {
    const alertas = await all(`
      SELECT
        id_produto,
        produto,
        id_variacao,
        cor,
        tamanho,
        sku,
        quantidade,
        estoque_min,
        status
      FROM vw_alertas_estoque
    `);

    return res.json(alertas);
  } catch (error) {
    console.error("[ESTOQUE] erro ao listar alertas:", error.message);

    return res.status(500).json({
      erro: "Erro ao listar alertas de estoque.",
    });
  }
}

async function buscarEstoquePorVariacao(req, res) {
  try {
    const idVariacao = Number(req.params.id_variacao);

    if (!Number.isInteger(idVariacao) || idVariacao <= 0) {
      return res.status(400).json({
        erro: "id_variacao inválido.",
      });
    }

    const item = await get(
      `
        SELECT
          id_produto,
          produto,
          descricao,
          produto_ativo,
          id_variacao,
          cor,
          tamanho,
          sku,
          preco,
          variacao_ativa,
          quantidade,
          estoque_min,
          atualizado_em,
          status
        FROM vw_estoque_detalhado
        WHERE id_variacao = ?
      `,
      [idVariacao],
    );

    if (!item) {
      return res.status(404).json({
        erro: "Estoque da variação não encontrado.",
      });
    }

    return res.json(item);
  } catch (error) {
    console.error("[ESTOQUE] erro ao buscar variação:", error.message);

    return res.status(500).json({
      erro: "Erro ao buscar estoque da variação.",
    });
  }
}

module.exports = {
  listarEstoque,
  listarAlertasEstoque,
  buscarEstoquePorVariacao,
};
