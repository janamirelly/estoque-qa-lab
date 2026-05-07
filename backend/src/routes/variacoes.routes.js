const express = require("express");
const router = express.Router();

const {
  listarVariacoesPorProduto,
  criarVariacao,
} = require("../controllers/variacoes.controller");

// GET /produtos/:id_produto/variacoes
router.get("/:id_produto/variacoes", listarVariacoesPorProduto);

// POST /produtos/:id_produto/variacoes
router.post("/:id_produto/variacoes", criarVariacao);

module.exports = router;
