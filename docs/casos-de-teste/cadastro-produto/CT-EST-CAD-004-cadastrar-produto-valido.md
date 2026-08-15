# CT-EST-CAD-004 — Cadastrar produto com dados válidos

## Identificação

* **Módulo:** Estoque
* **Funcionalidade:** Cadastro de produto
* **Camada:** UI
* **Tipo de teste:** Funcional positivo
* **Técnica de teste:** Particionamento de Equivalência — classe válida
* **Regra relacionada:** RN-010 — Cadastro de produto com variação válida
* **Critério de aceite relacionado:** CA-010
* **Ambiente:** Desenvolvimento local
* **Status:** Passou
* **Data da execução:** 09/08/2026

## Objetivo

Verificar se o sistema permite o cadastro de um produto quando os campos obrigatórios e os dados da variação são preenchidos com valores válidos.

## Pré-condições

* Aplicação disponível em ambiente de desenvolvimento local.
* Backend/API em execução.
* Tela **Cadastrar Produto** acessível.
* SKU `CAM-VO-M` não cadastrado previamente no banco de dados.

## Massa de teste

| Campo              | Valor             |
| ------------------ | ----------------- |
| Nome do produto    | `Camiseta Básica` |
| Cor                | `VERDE OLIVA`     |
| Tamanho            | `M`               |
| SKU                | `CAM-VO-M`        |
| Preço              | `69.90`           |
| Quantidade inicial | `0`               |
| Estoque mínimo     | `10`              |

## Passos

1. Acessar a aplicação Estoque QA Lab.
2. Navegar até a tela **Cadastrar Produto**.
3. Consultar o banco de dados e confirmar que o SKU `CAM-VO-M` não está cadastrado.
4. Preencher o formulário conforme a massa de teste.
5. Clicar em **Cadastrar produto**.
6. Verificar a mensagem apresentada pela aplicação.
7. Consultar o estoque pelo SKU utilizado.
8. Consultar o banco de dados utilizando o SKU `CAM-VO-M`.

## Resultado esperado

* O sistema deve concluir o cadastro.
* O sistema deve exibir a mensagem `Produto cadastrado com sucesso`.
* O produto deve ser localizado na consulta de estoque.
* O registro correspondente ao SKU `CAM-VO-M` deve estar persistido no banco de dados.

## Resultado obtido

* O sistema concluiu o cadastro.
* A mensagem `Produto cadastrado com sucesso` foi exibida.
* O produto foi localizado na consulta de estoque.
* A consulta no banco de dados pelo SKU `CAM-VO-M` retornou o produto cadastrado, confirmando sua persistência.

## Evidências

* **EVD-CT-EST-CAD-004-01 — Pré-condição:** consulta no banco confirmando que o SKU `CAM-VO-M` não estava cadastrado.
  [Ver evidência](c:/estoque-qa-lab/docs/evidencias/EVD-CT-EST-EDT-001-01%20—%20Estado%20inicial%20da%20variação.png)

* **EVD-CT-EST-CAD-004-02 — Massa de teste:** formulário preenchido com os dados válidos utilizados na execução.
  [Ver evidência](../../evidencias/ct-est-cad-004/02-cadastro-dados-validos.png)

* **EVD-CT-EST-CAD-004-03 — Resultado na UI:** mensagem `Produto cadastrado com sucesso`.
  [Ver evidência](../../evidencias/ct-est-cad-004/03-mensagem-sucesso-exibida.png)

* **EVD-CT-EST-CAD-004-04 — Consulta na UI:** produto cadastrado localizado no estoque.
  [Ver evidência](../../evidencias/ct-est-cad-004/04-consulta-estoque-ui.png)

* **EVD-CT-EST-CAD-004-05 — Pós-condição:** consulta no banco confirmando a persistência do produto.
  [Ver evidência](../../evidencias/ct-est-cad-004/05-pos-condicao-banco.png)
