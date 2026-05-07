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
    db.run(sql, params, function callback(err) {
      if (err) return reject(err);

      resolve({
        lastID: this.lastID,
        changes: this.changes,
      });
    });
  });
}

function validarTipoMovimentacao(tipo) {
  return ["ENTRADA", "SAIDA", "AJUSTE"].includes(tipo);
}

function validarMotivoPorTipo(tipo, motivo) {
  const motivosPermitidos = {
    ENTRADA: ["REPOSICAO", "COMPRA", "DEVOLUCAO"],
    SAIDA: ["VENDA", "PERDA", "RETIRADA_OPERACIONAL"],
    AJUSTE: ["CORRECAO", "INVENTARIO"],
  };

  return motivosPermitidos[tipo]?.includes(motivo);
}

function formatarMotivo(motivo) {
  const motivos = {
    REPOSICAO: "Reposição de estoque",
    COMPRA: "Compra",
    DEVOLUCAO: "Devolução",
    VENDA: "Venda",
    PERDA: "Perda",
    RETIRADA_OPERACIONAL: "Retirada operacional",
    CORRECAO: "Correção de saldo",
    INVENTARIO: "Inventário",
  };

  return motivos[motivo] || motivo;
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
      message: "Erro ao listar estoque.",
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
      message: "Erro ao listar alertas de estoque.",
    });
  }
}

async function buscarEstoquePorVariacao(req, res) {
  try {
    const idVariacao = Number(req.params.id_variacao);

    if (!Number.isInteger(idVariacao) || idVariacao <= 0) {
      return res.status(400).json({
        message: "id_variacao inválido.",
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
        message: "Estoque da variação não encontrado.",
      });
    }

    return res.json(item);
  } catch (error) {
    console.error("[ESTOQUE] erro ao buscar variação:", error.message);

    return res.status(500).json({
      message: "Erro ao buscar estoque da variação.",
    });
  }
}

async function listarMovimentacoesEstoque(req, res) {
  try {
    const movimentacoes = await all(`
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
      ORDER BY datetime(criado_em) DESC
      LIMIT 50
    `);

    return res.json(movimentacoes);
  } catch (error) {
    console.error("[ESTOQUE] erro ao listar movimentações:", error.message);

    return res.status(500).json({
      message: "Erro ao listar movimentações de estoque.",
    });
  }
}

async function registrarMovimentacaoEstoque(req, res) {
  const { id_variacao, tipo, quantidade, motivo } = req.body;

  try {
    const idVariacao = Number(id_variacao);
    const quantidadeMovimentada = Number(quantidade);

    if (!Number.isInteger(idVariacao) || idVariacao <= 0) {
      return res.status(400).json({
        message: "id_variacao inválido.",
      });
    }

    if (!tipo || !validarTipoMovimentacao(tipo)) {
      return res.status(400).json({
        message: "Tipo de movimentação inválido.",
      });
    }

    if (
      !Number.isInteger(quantidadeMovimentada) ||
      quantidadeMovimentada <= 0
    ) {
      return res.status(400).json({
        message: "Quantidade deve ser um número inteiro maior que zero.",
      });
    }

    if (!motivo || !validarMotivoPorTipo(tipo, motivo)) {
      return res.status(400).json({
        message: "Motivo inválido para o tipo de movimentação informado.",
      });
    }

    const item = await get(
      `
        SELECT
          p.id_produto,
          p.nome AS produto,
          vp.id_variacao,
          vp.cor,
          vp.tamanho,
          vp.sku,
          COALESCE(e.quantidade, 0) AS quantidade,
          COALESCE(e.estoque_min, 5) AS estoque_min
        FROM variacao_produto vp
        JOIN produto p
          ON p.id_produto = vp.id_produto
        LEFT JOIN estoque e
          ON e.id_variacao = vp.id_variacao
        WHERE vp.id_variacao = ?
          AND vp.ativo = 1
          AND p.ativo = 1
      `,
      [idVariacao],
    );

    if (!item) {
      return res.status(404).json({
        message: "Produto ou variação não encontrado.",
      });
    }

    const estoqueAnterior = Number(item.quantidade);
    let estoqueAtualizado = estoqueAnterior;

    if (tipo === "ENTRADA") {
      estoqueAtualizado = estoqueAnterior + quantidadeMovimentada;
    }

    if (tipo === "SAIDA") {
      if (quantidadeMovimentada > estoqueAnterior) {
        return res.status(409).json({
          message:
            "Saída não permitida: quantidade maior que o estoque disponível.",
          estoque: {
            anterior: estoqueAnterior,
            atual: estoqueAnterior,
          },
        });
      }

      estoqueAtualizado = estoqueAnterior - quantidadeMovimentada;
    }

    if (tipo === "AJUSTE") {
      estoqueAtualizado = quantidadeMovimentada;
    }

    let movimentacaoRegistrada = null;

    await run("BEGIN TRANSACTION");

    try {
      const movimentacaoCriada = await run(
        `
    INSERT INTO movimentacao_estoque (
      id_variacao,
      tipo,
      quantidade,
      observacao
    )
    VALUES (?, ?, ?, ?)
  `,
        [idVariacao, tipo, quantidadeMovimentada, motivo],
      );

      movimentacaoRegistrada = await get(
        `
    SELECT
      id_movimentacao,
      criado_em
    FROM movimentacao_estoque
    WHERE id_movimentacao = ?
  `,
        [movimentacaoCriada.lastID],
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
          ON CONFLICT(id_variacao)
          DO UPDATE SET
            quantidade = excluded.quantidade,
            atualizado_em = datetime('now','localtime')
        `,
        [idVariacao, estoqueAtualizado, item.estoque_min],
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
          "ESTOQUE_MOVIMENTADO",
          `variacao:${idVariacao}`,
          JSON.stringify({
            tipo,
            motivo,
            quantidade: quantidadeMovimentada,
            estoque_anterior: estoqueAnterior,
            estoque_atual: estoqueAtualizado,
          }),
        ],
      );

      await run("COMMIT");
    } catch (error) {
      await run("ROLLBACK");
      throw error;
    }

    return res.status(201).json({
      message: "Movimentação registrada com sucesso.",
      movimentacao: {
        id_movimentacao: movimentacaoRegistrada.id_movimentacao,
        tipo,
        quantidade: quantidadeMovimentada,
        motivo,
        motivo_descricao: formatarMotivo(motivo),
        data: movimentacaoRegistrada.criado_em,
      },
      estoque: {
        anterior: estoqueAnterior,
        atual: estoqueAtualizado,
      },
      produto: {
        id_produto: item.id_produto,
        id_variacao: item.id_variacao,
        nome: item.produto,
        sku: item.sku,
        cor: item.cor,
        tamanho: item.tamanho,
        variacao: `${item.cor} / ${item.tamanho}`,
      },
    });
  } catch (error) {
    console.error("[ESTOQUE] erro ao registrar movimentação:", error.message);

    return res.status(500).json({
      message: "Erro ao registrar movimentação de estoque.",
    });
  }
}

module.exports = {
  listarEstoque,
  listarAlertasEstoque,
  buscarEstoquePorVariacao,
  listarMovimentacoesEstoque,
  registrarMovimentacaoEstoque,
};
