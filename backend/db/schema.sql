PRAGMA foreign_keys = ON;

-- =========================================================
-- 1) PRODUTO
-- =========================================================

CREATE TABLE IF NOT EXISTS produto (
  id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
  nome       TEXT NOT NULL,
  descricao  TEXT,
  ativo      INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0,1)),
  criado_em  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- =========================================================
-- 2) VARIAÇÃO DO PRODUTO
-- =========================================================

CREATE TABLE IF NOT EXISTS variacao_produto (
  id_variacao         INTEGER PRIMARY KEY AUTOINCREMENT,
  id_produto          INTEGER NOT NULL,
  cor                 TEXT NOT NULL,
  tamanho             TEXT NOT NULL,
  cor_normalizada     TEXT NOT NULL,
  tamanho_normalizado TEXT NOT NULL,
  sku                 TEXT NOT NULL UNIQUE,
  preco               REAL NOT NULL DEFAULT 0 CHECK (preco >= 0),
  ativo               INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0,1)),
  criado_em           TEXT NOT NULL DEFAULT (datetime('now','localtime')),

  FOREIGN KEY (id_produto) REFERENCES produto(id_produto),

  UNIQUE (id_produto, cor_normalizada, tamanho_normalizado)
);

-- =========================================================
-- 3) ESTOQUE
-- =========================================================

CREATE TABLE IF NOT EXISTS estoque (
  id_estoque    INTEGER PRIMARY KEY AUTOINCREMENT,
  id_variacao   INTEGER NOT NULL UNIQUE,
  quantidade    INTEGER NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
  estoque_min   INTEGER NOT NULL DEFAULT 10 CHECK (estoque_min >= 0),
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now','localtime')),

  FOREIGN KEY (id_variacao) REFERENCES variacao_produto(id_variacao)
);

-- =========================================================
-- 4) MOVIMENTAÇÃO DE ESTOQUE
-- =========================================================

CREATE TABLE IF NOT EXISTS movimentacao_estoque (
  id_movimentacao INTEGER PRIMARY KEY AUTOINCREMENT,
  id_variacao      INTEGER NOT NULL,
  tipo             TEXT NOT NULL CHECK (tipo IN ('ENTRADA','SAIDA','AJUSTE')),
  quantidade       INTEGER NOT NULL CHECK (quantidade > 0),
  observacao       TEXT,
  criado_em        TEXT NOT NULL DEFAULT (datetime('now','localtime')),

  FOREIGN KEY (id_variacao) REFERENCES variacao_produto(id_variacao)
);

-- =========================================================
-- 5) AUDITORIA SIMPLES
-- =========================================================

CREATE TABLE IF NOT EXISTS auditoria (
  id_auditoria INTEGER PRIMARY KEY AUTOINCREMENT,
  acao         TEXT NOT NULL,
  recurso      TEXT,
  detalhes     TEXT,
  criado_em    TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- =========================================================
-- 6) ÍNDICES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_variacao_produto
  ON variacao_produto(id_produto);

CREATE INDEX IF NOT EXISTS idx_variacao_sku
  ON variacao_produto(sku);

CREATE INDEX IF NOT EXISTS idx_estoque_variacao
  ON estoque(id_variacao);

CREATE INDEX IF NOT EXISTS idx_movimentacao_variacao
  ON movimentacao_estoque(id_variacao);

CREATE INDEX IF NOT EXISTS idx_movimentacao_criado_em
  ON movimentacao_estoque(criado_em);

CREATE INDEX IF NOT EXISTS idx_auditoria_acao
  ON auditoria(acao);