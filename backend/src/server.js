const express = require("express");
const cors = require("cors");

require("./db/database");
const produtosRoutes = require("./routes/produtos.routes");
const estoqueRoutes = require("./routes/estoque.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const movimentacoesRoutes = require("./routes/movimentacoes.routes");
const variacoesRoutes = require("./routes/variacoes.routes");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Estoque QA Lab API rodando com sucesso",
    modulo: "estoque",
    status: "online",
  });
});

app.use("/produtos", produtosRoutes);
app.use("/estoque", estoqueRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/movimentacoes", movimentacoesRoutes);
app.use("/produtos", variacoesRoutes);

app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada.",
    metodo: req.method,
    caminho: req.originalUrl,
  });
});

app.use((error, req, res, next) => {
  console.error("[SERVER] erro não tratado:", error);

  res.status(500).json({
    erro: "Erro interno no servidor.",
  });
});

const server = app.listen(PORT, () => {
  console.log(`Estoque QA Lab API rodando em http://localhost:${PORT}`);
});

server.on("error", (error) => {
  console.error("[SERVER] erro ao iniciar servidor:", error.message);
});

process.on("SIGINT", () => {
  console.log("\n[SERVER] encerrando servidor...");

  server.close(() => {
    console.log("[SERVER] servidor encerrado.");
    process.exit(0);
  });
});
