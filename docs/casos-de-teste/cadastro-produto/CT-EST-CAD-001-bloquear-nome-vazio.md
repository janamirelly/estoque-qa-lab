# CT-EST-CAD-001 — Bloquear cadastro com nome vazio

## Identificação

* **Módulo:** Estoque
* **Funcionalidade:** Cadastro de produto
* **Camada:** UI
* **Tipo de teste:** Funcional negativo
* **Técnica de teste:** Particionamento de Equivalência — classe inválida
* **Regra relacionada:** RN-001 — Nome do produto deve ser obrigatório e válido
* **Critério de aceite relacionado:** CA-001
* **Ambiente:** Desenvolvimento local
* **Automação:** Sim
* **Status:** Passou
* **Data da execução:** 19/08/2026

## Objetivo

Verificar se o sistema impede o cadastro quando o campo **Nome do produto** não é preenchido, conforme a obrigatoriedade definida na RN-001.

## Pré-condições

* Aplicação disponível em ambiente de desenvolvimento local.
* Backend/API em execução.
* Banco de dados disponível.
* Tela **Cadastrar Produto** acessível.
* Demais campos obrigatórios preenchidos com valores válidos.
* SKU válido gerado dinamicamente e não cadastrado previamente.

## Massa de teste

| Campo | Valor |
| --- | --- |
| Nome do produto | vazio |
| Cor | `Verde Oliva` |
| Tamanho | `P` |
| SKU | Gerado dinamicamente |
| Preço | `69.90` |
| Quantidade inicial | `0` |
| Estoque mínimo | `10` |

## Passos

1. Acessar a aplicação VarejoSync — Módulo de Estoque.
2. Navegar até **Cadastrar Produto**.
3. Manter o campo **Nome do produto** vazio.
4. Preencher os demais campos obrigatórios com dados válidos.
5. Clicar em **Cadastrar produto**.
6. Verificar a mensagem apresentada pelo sistema.

## Resultado esperado

* O sistema deve impedir a conclusão do cadastro.
* O campo Nome do produto vazio deve ser considerado inválido.
* O sistema deve exibir a mensagem `Informe um nome de produto válido`.
* O cadastro não deve ser concluído.

## Resultado obtido

* O sistema impediu a conclusão do cadastro.
* A mensagem `Informe um nome de produto válido` foi apresentada.
* O comportamento ficou de acordo com a RN-001 e o CA-001.

## Status

**Passou**

## Automação relacionada

* **Classe:** `CadastroProdutoNegativoTest`
* **Método:** `CT_EST_CAD_001_bloquearCadastroComNomeVazio()`
* **Status da última execução:** Passou

A automação preenche o formulário com o campo Nome do produto vazio e os demais campos com dados válidos, executa a tentativa de cadastro e valida a mensagem de bloqueio esperada.