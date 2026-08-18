# CA-013 — Inativar somente a variação selecionada

**Regra relacionada:** RN-013 — Inativação lógica individual de variação

## Objetivo

Validar que a ação de exclusão realizada sobre uma variação do produto inative somente a variação selecionada, preservando o produto de origem e as demais variações vinculadas ao mesmo `id_produto`.

## Cenário — Inativar uma variação sem afetar as demais

**Dado** que exista o produto `Blusa Canelada` com `id_produto = 217` e estado ativo
**E** que o produto possua a variação `BLU-PRETA-P`, com `id_variacao = 234`, em estado ativo
**E** que o produto possua a variação `BLU-PRETA-M`, com `id_variacao = 235`, em estado ativo
**E** que ambas as variações estejam vinculadas ao mesmo `id_produto = 217`
**E** que ambas sejam apresentadas na consulta de estoque
**Quando** o usuário solicitar a exclusão da variação `BLU-PRETA-M`
**Então** o sistema deve solicitar confirmação identificando a SKU `BLU-PRETA-M`
**Quando** o usuário confirmar a operação
**Então** somente a variação `BLU-PRETA-M` deve ser inativada
**E** o produto `Blusa Canelada` deve permanecer ativo
**E** a variação `BLU-PRETA-P` deve permanecer ativa
**E** a variação `BLU-PRETA-M` não deve mais ser apresentada na consulta de variações ativas
**E** a variação `BLU-PRETA-P` deve continuar sendo apresentada na consulta de estoque
**E** o sistema deve exibir a mensagem `Variação excluída com sucesso.`

## Estado esperado no banco de dados

Após a confirmação da operação:

| Entidade                 | Identificador                       | Estado esperado              |
| ------------------------ | ----------------------------------- | ---------------------------- |
| Produto                  | `id_produto = 217`                  | `produto.ativo = 1`          |
| Variação não selecionada | `id_variacao = 234` / `BLU-PRETA-P` | `variacao_produto.ativo = 1` |
| Variação selecionada     | `id_variacao = 235` / `BLU-PRETA-M` | `variacao_produto.ativo = 0` |

Os registros devem permanecer fisicamente armazenados no banco de dados.

## Estado esperado na interface

Após a inativação:

| SKU           | Resultado esperado                          |
| ------------- | ------------------------------------------- |
| `BLU-PRETA-M` | Não deve aparecer entre as variações ativas |
| `BLU-PRETA-P` | Deve continuar disponível na consulta       |

## Critérios para aprovação

O cenário será considerado **Passou** somente se todas as condições abaixo forem atendidas:

* a confirmação identificar a variação selecionada;
* somente a variação selecionada for inativada;
* o produto de origem permanecer ativo;
* as demais variações vinculadas permanecerem ativas;
* a variação inativada deixar de aparecer na consulta de estoque ativo;
* as demais variações continuarem disponíveis;
* os registros permanecerem armazenados no banco;
* a mensagem `Variação excluída com sucesso.` for exibida.

Se qualquer uma dessas condições não for atendida, o cenário deve ser considerado **Falhou**.
