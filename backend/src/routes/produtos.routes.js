const express = require("express");
const router = express.Router();

const {
  listarProdutos,
  criarProduto,
  editarProduto,
  deletarProduto,
  excluirProdutosEmMassa,
} = require("../controllers/produtos.controller");

// GET /produtos
router.get("/", listarProdutos);

// POST /produtos
router.post("/", criarProduto);

// PUT /produtos/:idVariacao
router.put("/:idVariacao", editarProduto);

// DELETE /produtos/:idVariacao
router.delete("/:idVariacao", deletarProduto);

//PATCH / produtos / exclusao-massa
router.patch("/exclusao-massa", excluirProdutosEmMassa);

module.exports = router;
