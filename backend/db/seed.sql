PRAGMA foreign_keys = ON;

-- =========================================================
-- 1) PRODUTOS
-- =========================================================

INSERT OR IGNORE INTO produto (id_produto, nome, descricao, ativo)
VALUES
  (1, 'Camiseta Básica', 'Camiseta básica em algodão.', 1),
  (2, 'Vestido Midi', 'Vestido midi casual.', 1),
  (3, 'Calça Jeans', 'Calça jeans azul.', 1);

-- =========================================================
-- 2) VARIAÇÕES
-- =========================================================

INSERT OR IGNORE INTO variacao_produto (
  id_variacao,
  id_produto,
  cor,
  tamanho,
  cor_normalizada,
  tamanho_normalizado,
  sku,
  preco,
  ativo
)
VALUES
  -- Camiseta Básica
  (1,  1, 'BRANCO', 'P',  'BRANCO', 'P',  'CAM-BRANCO-P',  59.90, 1),
  (2,  1, 'BRANCO', 'M',  'BRANCO', 'M',  'CAM-BRANCO-M',  59.90, 1),
  (3,  1, 'BRANCO', 'G',  'BRANCO', 'G',  'CAM-BRANCO-G',  59.90, 1),
  (4,  1, 'BRANCO', 'GG', 'BRANCO', 'GG', 'CAM-BRANCO-GG', 59.90, 1),

  (5,  1, 'PRETO',  'P',  'PRETO',  'P',  'CAM-PRETO-P',   59.90, 1),
  (6,  1, 'PRETO',  'M',  'PRETO',  'M',  'CAM-PRETO-M',   59.90, 1),
  (7,  1, 'PRETO',  'G',  'PRETO',  'G',  'CAM-PRETO-G',   59.90, 1),
  (8,  1, 'PRETO',  'GG', 'PRETO',  'GG', 'CAM-PRETO-GG',  59.90, 1),

  -- Vestido Midi
  (9,  2, 'AZUL',   'P',  'AZUL',   'P',  'VES-AZUL-P',    129.90, 1),
  (10, 2, 'AZUL',   'M',  'AZUL',   'M',  'VES-AZUL-M',    129.90, 1),
  (11, 2, 'AZUL',   'G',  'AZUL',   'G',  'VES-AZUL-G',    129.90, 1),
  (12, 2, 'AZUL',   'GG', 'AZUL',   'GG', 'VES-AZUL-GG',   129.90, 1),

  (13, 2, 'PRETO',  'P',  'PRETO',  'P',  'VES-PRETO-P',   129.90, 1),
  (14, 2, 'PRETO',  'M',  'PRETO',  'M',  'VES-PRETO-M',   129.90, 1),
  (15, 2, 'PRETO',  'G',  'PRETO',  'G',  'VES-PRETO-G',   129.90, 1),
  (16, 2, 'PRETO',  'GG', 'PRETO',  'GG', 'VES-PRETO-GG',  129.90, 1),

  -- Calça Jeans
  (17, 3, 'AZUL', 'P',  'AZUL', 'P',  'CAL-AZUL-P',  99.90, 1),
  (18, 3, 'AZUL', 'M',  'AZUL', 'M',  'CAL-AZUL-M',  99.90, 1),
  (19, 3, 'AZUL', 'G',  'AZUL', 'G',  'CAL-AZUL-G',  99.90, 1),
  (20, 3, 'AZUL', 'GG', 'AZUL', 'GG', 'CAL-AZUL-GG', 99.90, 1);

-- =========================================================
-- 3) ESTOQUE BASE
-- Cenários:
-- DISPONIVEL, ATENCAO, CRITICO e ESGOTADO
-- =========================================================

INSERT OR IGNORE INTO estoque (id_variacao, quantidade, estoque_min)
VALUES
  -- Disponível
  (1,  20, 5),
  (2,  12, 5),
  (3,   8, 5),
  (4,   7, 5),

  -- Atenção
  (5,   5, 5),
  (6,   4, 5),

  -- Crítico
  (7,   1, 5),

  -- Esgotado
  (8,   0, 5),

  -- Vestido Midi
  (9,  10, 4),
  (10,  6, 4),
  (11,  4, 4),
  (12,  2, 4),
  (13,  8, 4),
  (14,  3, 4),
  (15,  1, 4),
  (16,  0, 4),

  -- Calça Jeans
  (17, 14, 5),
  (18,  9, 5),
  (19,  4, 5),
  (20,  0, 5);

-- =========================================================
-- 4) MOVIMENTAÇÕES INICIAIS
-- =========================================================

INSERT INTO movimentacao_estoque (
  id_variacao,
  tipo,
  quantidade,
  observacao
)
VALUES
  (1, 'ENTRADA', 20, 'Seed: entrada inicial de estoque.'),
  (7, 'AJUSTE', 1, 'Seed: ajuste para simular item crítico.'),
  (8, 'AJUSTE', 1, 'Seed: ajuste para simular item esgotado.'),
  (5, 'SAIDA', 1, 'Seed: saída manual para teste de histórico.');

-- =========================================================
-- 5) AUDITORIA DO SEED
-- =========================================================

INSERT INTO auditoria (acao, recurso, detalhes)
VALUES
  (
    'SEED_EXECUTADO',
    'seed.sql',
    'Produtos, variações, estoque e movimentações iniciais criados.'
  );