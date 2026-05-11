-- SQLite
SELECT
  p.id_produto,
  p.nome AS produto,
  v.id_variacao,
  v.sku,
  v.cor,
  v.tamanho,
  e.quantidade,
  e.estoque_min
FROM produto p
JOIN variacao_produto v
  ON v.id_produto = p.id_produto
LEFT JOIN estoque e
  ON e.id_variacao = v.id_variacao
ORDER BY p.nome, v.sku;

UPDATE variacao_produto
SET
  sku = 'TEN-CAS-PRETO-38',
  tamanho = '38'
WHERE id_variacao = 31;

SELECT
  id_variacao,
  id_produto,
  sku,
  cor,
  tamanho
FROM variacao_produto
WHERE id_variacao = 31;

SELECT
  p.id_produto,
  p.nome AS produto,
  v.id_variacao,
  v.sku,
  v.cor,
  v.tamanho,
  e.quantidade,
  e.estoque_min
FROM produto p
JOIN variacao_produto v
  ON v.id_produto = p.id_produto
LEFT JOIN estoque e
  ON e.id_variacao = v.id_variacao
WHERE v.id_variacao = 31;


SELECT
  m.id_movimentacao,
  p.nome AS produto,
  v.id_variacao,
  v.sku,
  v.cor,
  v.tamanho,
  m.tipo,
  m.quantidade,
  m.observacao,
  m.criado_em
FROM movimentacao_estoque m
JOIN variacao_produto v
  ON v.id_variacao = m.id_variacao
JOIN produto p
  ON p.id_produto = v.id_produto
WHERE DATE(m.criado_em) = '2026-05-08'
ORDER BY m.criado_em DESC;


SELECT
  m.id_movimentacao,
  p.nome AS produto,
  v.id_variacao,
  v.sku,
  v.cor,
  v.tamanho,
  m.tipo,
  m.quantidade,
  m.observacao,
  m.criado_em
FROM movimentacao_estoque m
JOIN variacao_produto v
  ON v.id_variacao = m.id_variacao
JOIN produto p
  ON p.id_produto = v.id_produto
WHERE DATE(m.criado_em) = '2026-05-08'
  AND v.sku = 'TEN-CAS-PRETO-38'
ORDER BY m.criado_em DESC;

SELECT
  id_estoque,
  id_variacao,
  quantidade,
  estoque_min,
  atualizado_em
FROM estoque
WHERE estoque_min < 10;

UPDATE estoque
SET estoque_min = 10
WHERE estoque_min < 10;


UPDATE estoque
SET
  estoque_min = 10,
  atualizado_em = datetime('now','localtime')
WHERE estoque_min < 10;


SELECT
  id_estoque,
  id_variacao,
  quantidade,
  estoque_min,
  atualizado_em
FROM estoque
ORDER BY id_estoque;