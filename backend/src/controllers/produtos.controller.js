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
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
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
      erro: "Erro ao listar produtos.",
    });
  }
}

async function criarProduto(req, res) {
  try {
    const nome = String(req.body.nome || "").trim();
    const descricao = String(req.body.descricao || "").trim();

    if (!nome) {
      return res.status(400).json({
        erro: "Nome do produto é obrigatório.",
      });
    }

    const result = await run(
      `
        INSERT INTO produto (nome, descricao, ativo)
        VALUES (?, ?, 1)
      `,
      [nome, descricao || null],
    );

    return res.status(201).json({
      id_produto: result.lastID,
      nome,
      descricao: descricao || null,
      ativo: 1,
    });
  } catch (error) {
    console.error("[PRODUTOS] erro ao criar:", error.message);

    return res.status(500).json({
      erro: "Erro ao criar produto.",
    });
  }
}

module.exports = {
  listarProdutos,
  criarProduto,
};
