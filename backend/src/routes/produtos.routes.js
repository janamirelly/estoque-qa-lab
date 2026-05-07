const express = require("express");
const router = express.Router();

const {
  listarProdutos,
  criarProduto,
} = require("../controllers/produtos.controller");

// GET /produtos
router.get("/", listarProdutos);

// POST /produtos
router.post("/", criarProduto);

module.exports = router;
