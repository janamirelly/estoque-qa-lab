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

    const produtosMesmoNome = await all(
      `
    SELECT
      p.id_produto,
      p.nome,
      vp.id_variacao,
      vp.cor_normalizada,
      vp.tamanho_normalizado
    FROM produto p
    INNER JOIN variacao_produto vp
      ON vp.id_produto = p.id_produto
  `,
    );

    const variacaoDuplicada = produtosMesmoNome.find((item) => {
      return (
        normalizarTexto(item.nome) === normalizarTexto(nome) &&
        item.cor_normalizada === corNormalizada &&
        item.tamanho_normalizado === tamanhoNormalizado
      );
    });

    if (variacaoDuplicada) {
      return res.status(409).json({
        message:
          "Já existe uma variação cadastrada para este produto com a mesma cor e tamanho.",
      });
    }

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
          "Já existe uma variação cadastrada para este produto com a mesma cor e tamanho..",
      });
    }

    return res.status(500).json({
      message: "Erro ao criar produto.",
    });
  }
}

async function editarProduto(req, res) {
  const idVariacao = Number(req.params.idVariacao);

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
    if (!Number.isInteger(idVariacao) || idVariacao <= 0) {
      return res.status(400).json({
        message: "ID da variação é inválido.",
      });
    }

    const produtoAtual = await all(
      `
        SELECT
          p.id_produto,
          p.nome,
          vp.id_variacao,
          vp.cor,
          vp.tamanho,
          vp.sku,
          vp.preco,
          e.quantidade,
          e.estoque_min
        FROM variacao_produto vp
        INNER JOIN produto p
          ON p.id_produto = vp.id_produto
        INNER JOIN estoque e
          ON e.id_variacao = vp.id_variacao
        WHERE vp.id_variacao = ?
      `,
      [idVariacao],
    );

    if (produtoAtual.length === 0) {
      return res.status(404).json({
        message: "Produto não encontrado para edição.",
      });
    }

    const produtoEncontrado = produtoAtual[0];

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

    const skuExistente = await all(
      `
        SELECT id_variacao
        FROM variacao_produto
        WHERE sku = ?
          AND id_variacao <> ?
      `,
      [sku, idVariacao],
    );

    if (skuExistente.length > 0) {
      return res.status(409).json({
        message: "SKU já cadastrado para outra variação.",
      });
    }

    const corNormalizada = normalizarTexto(cor);
    const tamanhoNormalizado = normalizarTexto(tamanho);

    const variacaoDuplicada = await all(
      `
        SELECT
          p.id_produto,
          p.nome,
          vp.id_variacao,
          vp.cor_normalizada,
          vp.tamanho_normalizado
        FROM produto p
        INNER JOIN variacao_produto vp
          ON vp.id_produto = p.id_produto
        WHERE vp.id_variacao <> ?
      `,
      [idVariacao],
    );

    const existeMesmaVariacao = variacaoDuplicada.find((item) => {
      return (
        normalizarTexto(item.nome) === normalizarTexto(nome) &&
        item.cor_normalizada === corNormalizada &&
        item.tamanho_normalizado === tamanhoNormalizado
      );
    });

    if (existeMesmaVariacao) {
      return res.status(409).json({
        message:
          "Já existe uma variação cadastrada para este produto com a mesma cor e tamanho.",
      });
    }

    await run("BEGIN TRANSACTION");

    try {
      await run(
        `
          UPDATE produto
          SET nome = ?
          WHERE id_produto = ?
        `,
        [nome, produtoEncontrado.id_produto],
      );

      await run(
        `
          UPDATE variacao_produto
          SET
            cor = ?,
            tamanho = ?,
            cor_normalizada = ?,
            tamanho_normalizado = ?,
            sku = ?,
            preco = ?
          WHERE id_variacao = ?
        `,
        [
          cor,
          tamanho,
          corNormalizada,
          tamanhoNormalizado,
          sku,
          preco,
          idVariacao,
        ],
      );

      await run(
        `
          UPDATE estoque
          SET
            quantidade = ?,
            estoque_min = ?,
            atualizado_em = datetime('now','localtime')
          WHERE id_variacao = ?
        `,
        [quantidade, estoqueMin, idVariacao],
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
          "PRODUTO_EDITADO",
          `variacao:${idVariacao}`,
          JSON.stringify({
            id_produto: produtoEncontrado.id_produto,
            id_variacao: idVariacao,
            antes: {
              nome: produtoEncontrado.nome,
              cor: produtoEncontrado.cor,
              tamanho: produtoEncontrado.tamanho,
              sku: produtoEncontrado.sku,
              preco: produtoEncontrado.preco,
              quantidade: produtoEncontrado.quantidade,
              estoque_min: produtoEncontrado.estoque_min,
            },
            depois: {
              nome,
              cor,
              tamanho,
              sku,
              preco,
              quantidade,
              estoque_min: estoqueMin,
            },
          }),
        ],
      );

      await run("COMMIT");

      return res.json({
        message: "Alteração salva com sucesso.",
        produto: {
          id_produto: produtoEncontrado.id_produto,
          nome,
          ativo: 1,
        },
        variacao: {
          id_variacao: idVariacao,
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
    console.error("[PRODUTOS] erro ao editar:", error.message);

    if (
      error.message.includes("UNIQUE constraint failed: variacao_produto.sku")
    ) {
      return res.status(409).json({
        message: "SKU já cadastrado para outra variação.",
      });
    }

    return res.status(500).json({
      message: "Erro ao editar produto.",
    });
  }
}

module.exports = {
  listarProdutos,
  criarProduto,
  editarProduto,
};
