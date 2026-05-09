const { db } = require("../db/database");

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function callback(err) {
      if (err) return reject(err);

      resolve({
        lastID: this.lastID,
        changes: this.changes,
      });
    });
  });
}

function normalizarTexto(valor) {
  return String(valor || "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function listarProdutos(req, res) {
  try {
    const produtos = await all(`
      SELECT
        id_produto,
        nome,
        descricao,
        ativo,
        criado_em
      FROM produto
      ORDER BY nome
    `);

    return res.json(produtos);
  } catch (error) {
    console.error("[PRODUTOS] erro ao listar:", error.message);

    return res.status(500).json({
      message: "Erro ao listar produtos.",
    });
  }
}

async function criarProduto(req, res) {
  const nome = String(req.body.nome || "").trim();
  const cor = String(req.body.cor || "").trim();
  const tamanho = String(req.body.tamanho || "").trim();
  const sku = String(req.body.sku || "")
    .trim()
    .toUpperCase();
  const precoRaw = req.body.preco;

  const precoTexto =
    precoRaw === undefined || precoRaw === null ? "" : String(precoRaw).trim();

  const preco = Number(precoTexto);
  const quantidade = Number(req.body.quantidade || 0);
  const estoqueMinRaw = req.body.estoque_min;

  const estoqueMin =
    estoqueMinRaw === undefined ||
    estoqueMinRaw === null ||
    estoqueMinRaw === ""
      ? null
      : Number(estoqueMinRaw);

  try {
    if (!nome) {
      return res.status(400).json({
        message: "Nome do produto é obrigatório.",
      });
    }

    if (!cor) {
      return res.status(400).json({
        message: "Cor da variação é obrigatória.",
      });
    }

    if (!tamanho) {
      return res.status(400).json({
        message: "Tamanho da variação é obrigatório.",
      });
    }

    if (!sku) {
      return res.status(400).json({
        message: "SKU da variação é obrigatório.",
      });
    }

    const precoValido = /^\d+(\.\d{1,2})?$/.test(precoTexto);

    if (!precoTexto || !precoValido || Number.isNaN(preco) || preco <= 0) {
      return res.status(400).json({
        message: "Informe um preço válido para a variação.",
      });
    }

    if (estoqueMin === null) {
      return res.status(400).json({
        message: "Estoque mínimo é obrigatório.",
      });
    }

    if (!Number.isInteger(estoqueMin) || estoqueMin < 10) {
      return res.status(400).json({
        message:
          "Estoque mínimo deve ser um número inteiro maior ou igual a 10.",
      });
    }

    if (!Number.isInteger(quantidade) || quantidade < 0) {
      return res.status(400).json({
        message:
          "Quantidade inicial deve ser um número inteiro maior ou igual a zero.",
      });
    }

    if (!Number.isInteger(estoqueMin) || estoqueMin < 0) {
      return res.status(400).json({
        message:
          "Estoque mínimo deve ser um número inteiro maior ou igual a zero.",
      });
    }

    const skuExistente = await all(
      `
        SELECT id_variacao
        FROM variacao_produto
        WHERE sku = ?
      `,
      [sku],
    );

    if (skuExistente.length > 0) {
      return res.status(409).json({
        message: "SKU já cadastrado para outra variação.",
      });
    }

    const corNormalizada = normalizarTexto(cor);
    const tamanhoNormalizado = normalizarTexto(tamanho);

    await run("BEGIN TRANSACTION");

    try {
      const produtoCriado = await run(
        `
    INSERT INTO produto (
      nome,
      descricao,
      ativo
    )
    VALUES (?, NULL, 1)
  `,
        [nome],
      );

      const variacaoCriada = await run(
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
          produtoCriado.lastID,
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
            estoque_min,
            atualizado_em
          )
          VALUES (?, ?, ?, datetime('now','localtime'))
        `,
        [variacaoCriada.lastID, quantidade, estoqueMin],
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
          "PRODUTO_CRIADO",
          `produto:${produtoCriado.lastID}`,
          JSON.stringify({
            id_produto: produtoCriado.lastID,
            id_variacao: variacaoCriada.lastID,
            nome,
            sku,
            quantidade,
            estoque_min: estoqueMin,
          }),
        ],
      );

      await run("COMMIT");

      return res.status(201).json({
        message: "Produto cadastrado com sucesso.",
        produto: {
          id_produto: produtoCriado.lastID,
          nome,
          ativo: 1,
        },
        variacao: {
          id_variacao: variacaoCriada.lastID,
          cor,
          tamanho,
          sku,
          preco,
          ativo: 1,
        },
        estoque: {
          quantidade,
          estoque_min: estoqueMin,
        },
      });
    } catch (error) {
      await run("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("[PRODUTOS] erro ao criar:", error.message);

    if (
      error.message.includes("UNIQUE constraint failed: variacao_produto.sku")
    ) {
      return res.status(409).json({
        message: "SKU já cadastrado para outra variação.",
      });
    }

    if (
      error.message.includes(
        "UNIQUE constraint failed: variacao_produto.id_produto",
      )
    ) {
      return res.status(409).json({
        message:
          "Produto já possui variação cadastrada com essa cor e tamanho.",
      });
    }

    return res.status(500).json({
      message: "Erro ao criar produto.",
    });
  }
}

module.exports = {
  listarProdutos,
  criarProduto,
};
