const express = require("express");
const router = express.Router();

const {
  listarEstoque,
  listarAlertasEstoque,
  buscarEstoquePorVariacao,
} = require("../controllers/estoque.controller");

// GET /estoque
router.get("/", listarEstoque);

// GET /estoque/alertas
router.get("/alertas", listarAlertasEstoque);

// GET /estoque/:id_variacao
router.get("/:id_variacao", buscarEstoquePorVariacao);

module.exports = router;
