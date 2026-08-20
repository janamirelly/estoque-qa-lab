# CA-013 — Inativar somente a variação selecionada

**Regra relacionada:** RN-013 — Inativação lógica individual de variação

## Objetivo

Definir as condições de aceite para a inativação lógica individual de uma variação, garantindo que a operação afete somente a variação selecionada e preserve o produto de origem e as demais variações vinculadas ao mesmo produto.

---

## Pré-condições

- deve existir um produto ativo;
- o produto deve possuir pelo menos duas variações ativas;
- as variações devem estar vinculadas ao mesmo `id_produto`;
- cada variação deve possuir seu próprio `id_variacao` e SKU;
- as variações devem estar disponíveis na consulta de estoque ativo.

---

## Cenário — Inativar uma variação sem afetar as demais

- **Dado** que exista um produto ativo com pelo menos duas variações ativas vinculadas ao mesmo `id_produto`
- **E** que cada variação possua identificação própria por `id_variacao` e SKU
- **E** que as variações estejam disponíveis na consulta de estoque
- **Quando** o usuário solicitar a exclusão de uma das variações
- **Então** o sistema deve solicitar confirmação da operação
- **E** a confirmação deve identificar claramente a variação selecionada pelo SKU
- **Quando** o usuário confirmar a operação
- **Então** somente a variação selecionada deve ser inativada
- **E** o produto de origem deve permanecer com seu estado inalterado
- **E** as demais variações vinculadas ao mesmo produto devem permanecer com seus estados inalterados
- **E** o registro da variação inativada deve permanecer armazenado fisicamente no banco de dados
- **E** a variação inativada não deve mais ser apresentada nas consultas de variações ativas
- **E** as demais variações ativas devem continuar disponíveis para consulta
- **E** o sistema deve exibir a mensagem `Variação excluída com sucesso.`

---

## Estado esperado no banco de dados

Após a confirmação da operação:

| Entidade | Estado esperado |
| --- | --- |
| Produto de origem | `produto.ativo` permanece inalterado |
| Variação selecionada | `variacao_produto.ativo = 0` |
| Demais variações do mesmo produto | `variacao_produto.ativo` permanece inalterado |

A operação deve ser lógica. Nenhum dos registros envolvidos deve ser removido fisicamente do banco de dados.

---

## Estado esperado na interface

Após a inativação:

| Elemento | Resultado esperado |
| --- | --- |
| Variação selecionada | Não deve aparecer entre as variações ativas |
| Demais variações ativas do mesmo produto | Devem continuar disponíveis na consulta |

---

## Critérios para aprovação

O cenário será considerado **Passou** somente se:

- a confirmação identificar corretamente a variação selecionada;
- somente a variação selecionada for inativada;
- o produto de origem permanecer com seu estado inalterado;
- as demais variações vinculadas permanecerem com seus estados inalterados;
- a variação inativada deixar de aparecer nas consultas de estoque ativo;
- as demais variações ativas continuarem disponíveis;
- os registros permanecerem fisicamente armazenados no banco de dados;
- a mensagem `Variação excluída com sucesso.` for exibida.

Se qualquer uma dessas condições não for atendida, o cenário deve ser considerado **Falhou**.

---

## Fora do escopo deste critério

Este critério não define:

- inativação do produto completo;
- inativação em massa de variações;
- comportamento quando a última variação ativa de um produto for inativada;
- reativação de variações;
- exclusão física dos registros.

Esses comportamentos dependem de regras de negócio específicas.
