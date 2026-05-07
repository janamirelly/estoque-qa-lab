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

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function normalizarTexto(valor) {
  return String(valor || "")
    .trim()
    .toUpperCase();
}

async function listarVariacoesPorProduto(req, res) {
  try {
    const idProduto = Number(req.params.id_produto);

    if (!Number.isInteger(idProduto) || idProduto <= 0) {
      return res.status(400).json({
        erro: "id_produto inválido.",
      });
    }

    const produto = await get(
      `
        SELECT id_produto
        FROM produto
        WHERE id_produto = ?
      `,
      [idProduto],
    );

    if (!produto) {
      return res.status(404).json({
        erro: "Produto não encontrado.",
      });
    }

    const variacoes = await all(
      `
        SELECT
          vp.id_variacao,
          vp.id_produto,
          vp.cor,
          vp.tamanho,
          vp.sku,
          vp.preco,
          vp.ativo,
          vp.criado_em,
          COALESCE(e.quantidade, 0) AS quantidade,
          COALESCE(e.estoque_min, 5) AS estoque_min
        FROM variacao_produto vp
        LEFT JOIN estoque e
          ON e.id_variacao = vp.id_variacao
        WHERE vp.id_produto = ?
        ORDER BY vp.cor, vp.tamanho
      `,
      [idProduto],
    );

    return res.json(variacoes);
  } catch (error) {
    console.error("[VARIACOES] erro ao listar:", error.message);

    return res.status(500).json({
      erro: "Erro ao listar variações do produto.",
    });
  }
}

async function criarVariacao(req, res) {
  try {
    const idProduto = Number(req.params.id_produto);

    const cor = String(req.body.cor || "").trim();
    const tamanho = String(req.body.tamanho || "").trim();
    const sku = String(req.body.sku || "")
      .trim()
      .toUpperCase();
    const preco = Number(req.body.preco || 0);
    const quantidadeInicial = Number(req.body.quantidade_inicial || 0);
    const estoqueMinimo = Number(req.body.estoque_min || 5);

    if (!Number.isInteger(idProduto) || idProduto <= 0) {
      return res.status(400).json({
        erro: "id_produto inválido.",
      });
    }

    if (!cor) {
      return res.status(400).json({
        erro: "Cor é obrigatória.",
      });
    }

    if (!tamanho) {
      return res.status(400).json({
        erro: "Tamanho é obrigatório.",
      });
    }

    if (!sku) {
      return res.status(400).json({
        erro: "SKU é obrigatório.",
      });
    }

    if (Number.isNaN(preco) || preco < 0) {
      return res.status(400).json({
        erro: "Preço deve ser um número maior ou igual a zero.",
      });
    }

    if (!Number.isInteger(quantidadeInicial) || quantidadeInicial < 0) {
      return res.status(400).json({
        erro: "Quantidade inicial deve ser um número inteiro maior ou igual a zero.",
      });
    }

    if (!Number.isInteger(estoqueMinimo) || estoqueMinimo < 0) {
      return res.status(400).json({
        erro: "Estoque mínimo deve ser um número inteiro maior ou igual a zero.",
      });
    }

    const produto = await get(
      `
        SELECT id_produto
        FROM produto
        WHERE id_produto = ?
      `,
      [idProduto],
    );

    if (!produto) {
      return res.status(404).json({
        erro: "Produto não encontrado.",
      });
    }

    const corNormalizada = normalizarTexto(cor);
    const tamanhoNormalizado = normalizarTexto(tamanho);

    await run("BEGIN");

    try {
      const result = await run(
        `
          INSERT INTO variacao_produto (
            id_produto,
            cor,
            tamanho,
            cor_normalizada,
            tamanho_normalizado,
            sku,
            preco,
            ativo
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `,
        [
          idProduto,
          cor,
          tamanho,
          corNormalizada,
          tamanhoNormalizado,
          sku,
          preco,
        ],
      );

      await run(
        `
          INSERT INTO estoque (
            id_variacao,
            quantidade,
            estoque_min
          )
          VALUES (?, ?, ?)
        `,
        [result.lastID, quantidadeInicial, estoqueMinimo],
      );

      await run(
        `
          INSERT INTO auditoria (
            acao,
            recurso,
            detalhes
          )
          VALUES (?, ?, ?)
        `,
        [
          "VARIACAO_CRIADA",
          "variacao_produto",
          JSON.stringify({
            id_variacao: result.lastID,
            id_produto: idProduto,
            sku,
            quantidade_inicial: quantidadeInicial,
            estoque_min: estoqueMinimo,
          }),
        ],
      );

      await run("COMMIT");

      return res.status(201).json({
        id_variacao: result.lastID,
        id_produto: idProduto,
        cor,
        tamanho,
        sku,
        preco,
        quantidade: quantidadeInicial,
        estoque_min: estoqueMinimo,
        ativo: 1,
      });
    } catch (transactionError) {
      await run("ROLLBACK");

      if (transactionError.message.includes("UNIQUE")) {
        return res.status(409).json({
          erro: "Já existe variação com este SKU ou combinação de cor/tamanho para o produto.",
        });
      }

      throw transactionError;
    }
  } catch (error) {
    console.error("[VARIACOES] erro ao criar:", error.message);

    return res.status(500).json({
      erro: "Erro ao criar variação do produto.",
    });
  }
}

module.exports = {
  listarVariacoesPorProduto,
  criarVariacao,
};
