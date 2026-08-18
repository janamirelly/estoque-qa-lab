# RN-013 — Inativação lógica individual de variação

## Objetivo

Garantir que uma variação de produto possa ser retirada do estoque ativo de forma individual, sem afetar o produto de origem nem outras variações vinculadas ao mesmo produto.

## Regra de negócio

O sistema deve permitir a **inativação lógica individual de uma variação** a partir da consulta de estoque.

Cada variação deve estar vinculada ao seu produto de origem por meio do `id_produto` e possuir identificação própria por `id_variacao` e SKU.

Ao confirmar a exclusão de uma variação, o sistema deve inativar somente a variação selecionada.

A operação não deve excluir fisicamente os registros do banco de dados.

## Condições

* O produto de origem deve estar ativo.
* A variação selecionada deve estar ativa antes da operação.
* A operação deve atuar sobre a variação selecionada por meio de seu `id_variacao`.
* O SKU deve identificar funcionalmente a variação apresentada ao usuário.
* O sistema deve solicitar confirmação antes de executar a operação.
* Após a confirmação, somente a variação selecionada deve ser inativada.
* O registro da variação deve permanecer armazenado no banco de dados.
* O produto de origem deve permanecer com seu estado inalterado.
* As demais variações vinculadas ao mesmo `id_produto` devem permanecer com seus estados inalterados.
* A variação inativada não deve ser apresentada nas consultas de variações ativas do estoque.
* As demais variações ativas do mesmo produto devem continuar disponíveis para consulta e operação.

## Estado esperado após a inativação

Para a variação selecionada:

`variacao_produto.ativo = 0`

Para o produto de origem:

`produto.ativo` deve permanecer inalterado.

Para as demais variações vinculadas ao mesmo produto:

`variacao_produto.ativo` deve permanecer inalterado.

## Exemplo

Considere o produto:

`Blusa Canelada — id_produto = 217`

Com as seguintes variações ativas:

| id_variacao | SKU           | Tamanho | Estado |
| ----------- | ------------- | ------- | ------ |
| 234         | `BLU-PRETA-P` | P       | Ativa  |
| 235         | `BLU-PRETA-M` | M       | Ativa  |

Ao solicitar e confirmar a exclusão da variação:

`BLU-PRETA-M — id_variacao = 235`

o estado esperado deve ser:

| Entidade                        | Estado esperado |
| ------------------------------- | --------------- |
| Produto `id_produto = 217`      | Permanece ativo |
| `BLU-PRETA-P` — id_variacao 234 | Permanece ativa |
| `BLU-PRETA-M` — id_variacao 235 | Inativa         |

A inativação de `BLU-PRETA-M` não deve alterar o estado do produto de origem nem da variação `BLU-PRETA-P`.

## Confirmação da operação

Antes da inativação, o sistema deve solicitar confirmação ao usuário identificando a variação selecionada.

A identificação deve permitir distinguir claramente qual SKU será inativado.

## Mensagem de sucesso

Após concluir a operação, o sistema deve exibir:

`Variação excluída com sucesso.`

## Fora do escopo

Esta regra não define:

* inativação do produto completo;
* inativação em massa de variações;
* comportamento quando a última variação ativa de um produto for inativada;
* reativação de variações;
* exclusão física de registros.

Esses comportamentos devem possuir regras específicas caso sejam implementados.


