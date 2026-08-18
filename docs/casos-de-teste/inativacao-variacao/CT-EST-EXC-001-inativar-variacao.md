# CT-EST-EXC-001 — Inativar somente a variação selecionada

## Identificação

* **Módulo:** Estoque
* **Funcionalidade:** Inativação de variação
* **Camada:** UI
* **Tipo de teste:** Funcional positivo
* **Técnica de teste:** Transição de Estado
* **Regra relacionada:** RN-013 — Inativação lógica individual de variação
* **Critério de aceite relacionado:** CA-013 — Inativar somente a variação selecionada
* **Ambiente:** Desenvolvimento local
* **Automação:** Sim — cobertura parcial
* **Status:** Falhou
* **Data da execução:** Não registrada

## Objetivo

Verificar se, ao solicitar a exclusão de uma variação específica na consulta de estoque, o sistema realiza a inativação lógica somente da variação selecionada, preservando o produto de origem e as demais variações vinculadas ao mesmo `id_produto`.

## Pré-condições

* Aplicação disponível em ambiente de desenvolvimento local.
* Backend/API em execução.
* Banco de dados disponível.
* Produto `Blusa Canelada` ativo.
* Produto identificado por `id_produto = 217`.
* Produto contendo pelo menos duas variações ativas vinculadas ao mesmo `id_produto`.
* Variação `BLU-PRETA-P`, `id_variacao = 234`, ativa.
* Variação `BLU-PRETA-M`, `id_variacao = 235`, ativa.
* Ambas as variações disponíveis na consulta de estoque.

## Massa de teste

| Entidade                 | Identificador | Valor            |
| ------------------------ | ------------- | ---------------- |
| Produto                  | `id_produto`  | `217`            |
| Produto                  | Nome          | `Blusa Canelada` |
| Variação não selecionada | `id_variacao` | `234`            |
| Variação não selecionada | SKU           | `BLU-PRETA-P`    |
| Variação selecionada     | `id_variacao` | `235`            |
| Variação selecionada     | SKU           | `BLU-PRETA-M`    |

### Estado inicial esperado

| Entidade                   | Estado                       |
| -------------------------- | ---------------------------- |
| Produto `id_produto = 217` | `produto.ativo = 1`          |
| `BLU-PRETA-P`              | `variacao_produto.ativo = 1` |
| `BLU-PRETA-M`              | `variacao_produto.ativo = 1` |

## Passos

1. Consultar o banco de dados e confirmar que `BLU-PRETA-P` e `BLU-PRETA-M` estão vinculadas ao mesmo `id_produto = 217`.
2. Confirmar que o produto está ativo.
3. Confirmar que as duas variações estão ativas.
4. Acessar a aplicação VarejoSync — Módulo de Estoque.
5. Navegar até **Consultar Estoque**.
6. Pesquisar pelo produto `Blusa Canelada`.
7. Confirmar que as variações `BLU-PRETA-P` e `BLU-PRETA-M` são apresentadas.
8. Clicar em **Excluir** na linha correspondente à SKU `BLU-PRETA-M`.
9. Verificar a identificação da variação apresentada na confirmação.
10. Confirmar a operação.
11. Verificar a mensagem apresentada pelo sistema.
12. Pesquisar novamente por `Blusa Canelada`.
13. Verificar quais variações permanecem disponíveis na consulta.
14. Consultar novamente o banco de dados.
15. Verificar o estado do produto `id_produto = 217`.
16. Verificar o estado da variação `BLU-PRETA-M`.
17. Verificar o estado da variação `BLU-PRETA-P`.

## Resultado esperado

Após confirmar a inativação de `BLU-PRETA-M`:

* somente a variação `BLU-PRETA-M` deve ser inativada;
* `BLU-PRETA-M` deve possuir `variacao_produto.ativo = 0`;
* o produto `Blusa Canelada` deve permanecer ativo com `produto.ativo = 1`;
* `BLU-PRETA-P` deve permanecer ativa com `variacao_produto.ativo = 1`;
* `BLU-PRETA-M` não deve mais aparecer na consulta de variações ativas;
* `BLU-PRETA-P` deve continuar disponível na consulta de estoque;
* os registros devem permanecer armazenados fisicamente no banco de dados;
* o sistema deve exibir a mensagem `Variação excluída com sucesso.`

## Resultado obtido

A operação não apresentou o comportamento esperado.

Após selecionar especificamente a variação:

`BLU-PRETA-M — id_variacao = 235`

e confirmar a exclusão:

* o sistema exibiu a mensagem `Produto excluído com sucesso.`;
* a consulta por `Blusa Canelada` deixou de apresentar as duas variações;
* o produto de origem foi inativado, assumindo `produto.ativo = 0`;
* a variação selecionada `BLU-PRETA-M` permaneceu ativa, com `variacao_produto.ativo = 1`;
* a variação não selecionada `BLU-PRETA-P` também permaneceu ativa, com `variacao_produto.ativo = 1`.

### Estado obtido no banco

| Entidade                   | Esperado    | Obtido        |
| -------------------------- | ----------- | ------------- |
| Produto `id_produto = 217` | `ativo = 1` | `ativo = 0` ❌ |
| `BLU-PRETA-P` — id 234     | `ativo = 1` | `ativo = 1` ✅ |
| `BLU-PRETA-M` — id 235     | `ativo = 0` | `ativo = 1` ❌ |

### Estado obtido na UI

| Comportamento | Esperado                         | Obtido                            |
| ------------- | -------------------------------- | --------------------------------- |
| `BLU-PRETA-M` | Não apresentada                  | Não apresentada                   |
| `BLU-PRETA-P` | Permanecer apresentada           | Não apresentada ❌                 |
| Mensagem      | `Variação excluída com sucesso.` | `Produto excluído com sucesso.` ❌ |

A ausência de `BLU-PRETA-M` na interface não representa uma inativação correta da variação. A investigação no banco demonstrou que a variação continuou ativa e que o produto de origem foi inativado.

## Status

**Falhou**

## Motivo da falha

A ação realizada sobre a variação `BLU-PRETA-M` inativou o produto de origem (`id_produto = 217`) em vez de inativar a variação selecionada (`id_variacao = 235`).

Como consequência, todas as variações vinculadas ao produto deixaram de ser apresentadas na consulta de estoque, embora continuassem marcadas como ativas na tabela `variacao_produto`.

O comportamento diverge da RN-013 e do CA-013.

## Evidências

* **EVD-CT-EST-EXC-001-01 — Pré-condição no banco:** produto `Blusa Canelada`, `id_produto = 217`, ativo e contendo as variações `BLU-PRETA-P` e `BLU-PRETA-M`, ambas ativas.
  [Ver evidência](../../evidencias/ct-est-exc-001/001-pre-condicao-banco.png)

* **EVD-CT-EST-EXC-001-02 — Estado inicial na UI:** consulta de estoque apresentando `BLU-PRETA-P` e `BLU-PRETA-M` antes da operação.
  [Ver evidência](../../evidencias/ct-est-exc-001/002-estado-inicial-ui.png)

* **EVD-CT-EST-EXC-001-03 — Confirmação da operação:** sistema solicitando confirmação da exclusão especificamente para `Blusa Canelada — BLU-PRETA-M`.
  [Ver evidência](../../evidencias/ct-est-exc-001/003-confirmacao-exclusao.png)

* **EVD-CT-EST-EXC-001-04 — Mensagem após a operação:** sistema exibindo `Produto excluído com sucesso.` após a confirmação.
  [Ver evidência](../../evidencias/ct-est-exc-001/004-mensagem-exclusao-sucesso.png)

* **EVD-CT-EST-EXC-001-05 — Pós-condição na UI:** consulta por `Blusa Canelada` sem apresentar as variações anteriormente disponíveis.
  [Ver evidência](../../evidencias/ct-est-exc-001/005-pos-condicao-ui.png)

* **EVD-CT-EST-EXC-001-06 — Pós-condição da variação selecionada no banco:** consulta de `BLU-PRETA-M` confirmando `produto_ativo = 0` e `variacao_ativa = 1`.
  [Ver evidência](../../evidencias/ct-est-exc-001/006-pos-condicao-banco-variacao-m.png)

* **EVD-CT-EST-EXC-001-07 — Pós-condição da variação não selecionada no banco:** consulta de `BLU-PRETA-P` confirmando `produto_ativo = 0` e `variacao_ativa = 1`.
  [Ver evidência](../../evidencias/ct-est-exc-001/007-pos-condicao-banco-variacao-p.png)

## Automação relacionada

**Classe:** `CadastroProdutoTest`

A automação existente cobre parcialmente este cenário.

O teste atual executa a operação de exclusão e valida se o produto deixa de permanecer ativo no banco. Essa validação reflete o comportamento antigo da aplicação e não atende integralmente à RN-013.

Após a correção do defeito, a automação deverá ser ajustada para validar:

* permanência do produto de origem como ativo;
* inativação da variação selecionada;
* permanência das demais variações como ativas;
* ausência somente da variação inativada na consulta de estoque.

A automação não deve ser alterada antes do registro e tratamento do defeito identificado.

