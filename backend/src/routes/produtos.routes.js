const express = require("express");
const router = express.Router();

const {
  listarProdutos,
  criarProduto,
  editarProduto,
} = require("../controllers/produtos.controller");

// GET /produtos
router.get("/", listarProdutos);

// POST /produtos
router.post("/", criarProduto);

// PUT /produtos/:idVariacao
router.put("/:idVariacao", editarProduto);

module.exports = router;
