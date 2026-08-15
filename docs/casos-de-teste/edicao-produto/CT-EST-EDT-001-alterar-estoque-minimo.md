# CT-EST-EDT-001 — Alterar estoque mínimo de uma variação com valor válido

## Identificação

* **Módulo:** Estoque
* **Funcionalidade:** Edição de produto
* **Camada:** UI
* **Tipo de teste:** Funcional positivo
* **Técnica de teste:** Particionamento de Equivalência — classe válida
* **Regra relacionada:** RN-011 — Alteração do estoque mínimo
* **Critério de aceite relacionado:** CA-011
* **Ambiente:** Desenvolvimento local

## Objetivo

Verificar se o sistema permite alterar o estoque mínimo de uma variação existente quando é informado um valor válido e se a alteração é persistida corretamente no banco de dados.

## Pré-condições

* Aplicação disponível em ambiente de desenvolvimento local.
* Backend/API em execução.
* Existência de um produto válido cadastrado para a execução do teste.
* Produto localizável na consulta de estoque por meio do SKU.

## Massa de teste

A massa de teste do produto é gerada pelos dados válidos definidos em `MassaCadastroProduto`.

O novo estoque mínimo utilizado na automação é obtido por:

`MassaCadastroProduto.novoEstoqueMinimoValidoEdicao()`.

## Passos

1. Acessar a aplicação Estoque QA Lab.
2. Garantir a existência de um produto válido cadastrado para o teste.
3. Navegar até a tela de consulta de estoque.
4. Pesquisar o produto pelo SKU.
5. Clicar em **Editar**.
6. Alterar o campo **Estoque mínimo** para um valor válido.
7. Clicar em **Salvar alterações**.
8. Verificar a mensagem apresentada pela aplicação.
9. Consultar o banco de dados e verificar o estoque mínimo da variação pelo SKU utilizado.

## Resultado esperado

* O sistema deve permitir a alteração do estoque mínimo.
* O sistema deve exibir a mensagem `Alteração salva com sucesso`.
* O novo valor de estoque mínimo deve ser persistido no banco de dados para a variação correspondente.

## Resultado obtido

O resultado obtido e as evidências devem permanecer de acordo com a execução já registrada no caso de teste original.

## Evidências

* **EVD-CT-EST-EDT-001-01 — Estado inicial da variação:** tela de edição da variação CAM-AZUL-M, apresentando estoque mínimo igual a 10 antes da alteração.
[Ver evidência](../../evidencias/01-estoque-minimo-antes-edicao.png)

* **EVD-CT-EST-EDT-001-02 — Novo estoque mínimo informado:** tela de edição da variação CAM-AZUL-M com o estoque mínimo alterado de 10 para 12, antes de salvar a alteração.
[Ver evidência](../../evidencias/02-novo-estoque-minimo.png)

* **EVD-CT-EST-EDT-001-03 — Confirmação da alteração:** sistema exibindo a mensagem Alteração salva com sucesso. após a operação.
[Ver evidência](../../evidencias/03-mensagem-alteracao-sucesso.png)

* **EVD-CT-EST-EDT-001-04 — Validação na consulta de estoque:** busca pela SKU CAM-AZUL-M após a edição, apresentando estoque mínimo igual a 12.
[Ver evidência](../../evidencias/04-estoque-minimo-atualizado-ui.png)

* **EVD-CT-EST-EDT-001-05 — Persistência no banco de dados:** consulta pelo SKU CAM-AZUL-M confirmando estoque mínimo igual a 12.
[Ver evidência](../../evidencias/05-pos-condicao-banco.png)






