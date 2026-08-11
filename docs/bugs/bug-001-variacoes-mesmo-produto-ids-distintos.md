# BUG-001 — Variações do mesmo produto são vinculadas a produtos distintos

## Identificação

- **Módulo:** Estoque
- **Funcionalidade:** Cadastro de produto e variações
- **Tipo:** Funcional / Integridade de dados
- **Severidade:** Alta
- **Prioridade sugerida:** Alta
- **Ambiente:** Desenvolvimento local
- **Regra relacionada:** RN-012 — Variações do mesmo produto devem permanecer vinculadas ao produto de origem
- **Status:** Corrigido — validação manual aprovada
- **Data:** 10/08/2026

## Descrição

Ao cadastrar diferentes variações de um mesmo produto, o sistema cria um novo registro de produto para cada variação.

Como consequência, variações que pertencem ao mesmo produto ficam associadas a diferentes valores de `id_produto`.

## Pré-condições

- Aplicação e backend em execução.
- Banco de dados SQLite disponível.
- Não existir previamente cadastro utilizando as SKUs definidas para o teste.

## Passos para reproduzir

1. Cadastrar o produto `Calça Jeans` com uma variação válida.
2. Cadastrar novas variações para o mesmo produto, utilizando SKUs diferentes.
3. Consultar no banco de dados os registros correspondentes às variações cadastradas.
4. Comparar o campo `id_produto` associado a cada SKU.

## Resultado esperado

Todas as variações pertencentes ao produto `Calça Jeans` devem estar vinculadas ao mesmo `id_produto`, mantendo identificadores próprios de variação.

Exemplo esperado:

| Produto | SKU | id_produto |
|---|---|---|
| Calça Jeans | CAL-PRETA-P | mesmo ID|
| Calça Jeans | CAL-PRETA-M | mesmo ID|
| Calça Jeans | CAL-PRETA-G | mesmo ID|

## Resultado obtido

As variações foram vinculadas a registros diferentes de produto:

| Produto | SKU | id_produto |
|---|---|---|
| Calça Jeans | CAL-PRETA-G | 11 |
| Calça Jeans | CAL-PRETA-M | 13 |
| Calça Jeans | CAL-PRETA-P | 10 |

Dessa forma, cada variação está sendo tratada no banco como pertencente a um produto distinto.

## Impacto

A inconsistência compromete o relacionamento entre produto e variações e pode afetar operações que dependem desse vínculo, como:

- edição;
- inativação/exclusão;
- agrupamento das variações;
- consultas de estoque;
- relatórios e movimentações.

## Consulta utilizada

```sql
SELECT
    p.id_produto,
    p.nome,
    p.ativo AS produto_ativo,
    vp.sku,
    vp.ativo AS variacao_ativa
FROM produto p
INNER JOIN variacao_produto vp
    ON vp.id_produto = p.id_produto
WHERE vp.sku IN (
    'CAL-PRETA-G',
    'CAL-PRETA-M',
    'CAL-PRETA-P'
)
ORDER BY vp.sku;
```

## Evidências do defeito

- **EVD-001 — Variações apresentadas na interface:** diferentes SKUs são apresentadas para o produto `Calça Jeans`.
  [Ver evidência](../evidencias/bug-001/01-variacoes-calca-jeans-ui.png)

- **EVD-002 — Inconsistência no banco de dados:** as variações estão associadas a diferentes valores de `id_produto`.
  [Ver evidência](../evidencias/bug-001/02-ids-produto-distintos-banco.png)

## Validação da correção

A correção foi validada com o cadastro de duas variações do produto `Blusa Canelada`:

- `BLU-PRETA-P`
- `BLU-PRETA-M`

Após os cadastros, foi realizada consulta no banco de dados.

### Resultado

As duas variações foram vinculadas ao mesmo produto:

| id_produto | Produto | id_variacao | SKU |
|---|---|---|---|
| 217 | Blusa Canelada | 235 | BLU-PRETA-M |
| 217 | Blusa Canelada | 234 | BLU-PRETA-P |

O comportamento está de acordo com a **RN-012 — Variações do mesmo produto devem permanecer vinculadas ao produto de origem**.

**Resultado da validação:** Aprovado.

### Evidência da correção

- [Consulta após a correção](../evidencias/bug-001/03-correcao-validada-banco.png)

