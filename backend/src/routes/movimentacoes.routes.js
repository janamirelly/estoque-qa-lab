const express = require("express");
const router = express.Router();

const {
  listarMovimentacoes,
  registrarMovimentacao,
} = require("../controllers/movimentacoes.controller");

// GET /movimentacoes
router.get("/", listarMovimentacoes);

// // POST /movimentacoes
// router.post("/", registrarMovimentacao);

module.exports = router;
