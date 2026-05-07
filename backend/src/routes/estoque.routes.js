const express = require("express");
const router = express.Router();

const {
  listarEstoque,
  listarAlertasEstoque,
  buscarEstoquePorVariacao,
  listarMovimentacoesEstoque,
  registrarMovimentacaoEstoque,
} = require("../controllers/estoque.controller");

// GET /estoque
router.get("/", listarEstoque);

// GET /estoque/alertas
router.get("/alertas", listarAlertasEstoque);

// GET /estoque/movimentacoes
router.get("/movimentacoes", listarMovimentacoesEstoque);

// POST /estoque/movimentacoes
router.post("/movimentacoes", registrarMovimentacaoEstoque);

// GET /estoque/:id_variacao
router.get("/:id_variacao", buscarEstoquePorVariacao);

module.exports = router;
