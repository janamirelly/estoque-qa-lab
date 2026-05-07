const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..", "..");

const dbPath = path.resolve(projectRoot, "db", "estoque_qa_lab.db");
const schemaPath = path.resolve(projectRoot, "db", "schema.sql");
const migrationsPath = path.resolve(projectRoot, "db", "migrations.sql");

console.log("[DB PATH]", dbPath);
console.log("[SCHEMA PATH]", schemaPath);
console.log("[MIGRATIONS PATH]", migrationsPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("[DB] erro ao conectar:", err.message);
    return;
  }

  console.log("[DB] SQLite conectado.");
});

function exec(sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function inicializarBanco() {
  try {
    await exec("PRAGMA foreign_keys = ON;");

    const schema = fs.readFileSync(schemaPath, "utf8");
    const migrations = fs.existsSync(migrationsPath)
      ? fs.readFileSync(migrationsPath, "utf8")
      : "";

    await exec(schema);
    console.log("[DB] schema executado com sucesso.");

    await exec(migrations);
    console.log("[DB] migrations executadas com sucesso.");
  } catch (error) {
    console.error("[DB] erro ao inicializar banco:", error.message);
  }
}

inicializarBanco();

module.exports = {
  db,
};
