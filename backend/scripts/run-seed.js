const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

const dbPath = path.resolve(projectRoot, "db", "estoque_qa_lab.db");
const seedPath = path.resolve(projectRoot, "db", "seed.sql");

console.log("[SEED] DB:", dbPath);
console.log("[SEED] seed:", seedPath);

const seed = fs.readFileSync(seedPath, "utf8");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("[SEED] erro ao conectar no banco:", err.message);
    process.exit(1);
  }

  console.log("[SEED] SQLite conectado.");

  db.run("PRAGMA foreign_keys = ON", (fkError) => {
    if (fkError) {
      console.error("[SEED] erro ao ativar foreign_keys:", fkError.message);
      db.close();
      process.exit(1);
    }

    db.exec(seed, (seedError) => {
      if (seedError) {
        console.error("[SEED] erro ao executar seed.sql:", seedError.message);
        db.close();
        process.exit(1);
      }

      console.log("[SEED] seed.sql executado com sucesso.");

      db.close((closeError) => {
        if (closeError) {
          console.error("[SEED] erro ao fechar conexão:", closeError.message);
          process.exit(1);
        }

        console.log("[SEED] conexão fechada.");
      });
    });
  });
});
