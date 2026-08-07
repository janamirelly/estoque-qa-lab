# CT-UI-001 — Bloquear cadastro com nome abaixo do limite mínimo

## Identificação

- **Módulo:** Estoque
- **Funcionalidade:** Cadastro de produto
- **Camada:** UI
- **Tipo de teste:** Funcional negativo
- **Técnica de teste:** Análise de Valor Limite
- **Regra relacionada:** RN-001 — Nome do produto deve ser obrigatório e válido
- **Critério de aceite relacionado:** A definir
- **Ambiente:** Desenvolvimento local
- **Status:** Passou
- **Data da execução:** 07/08/2026

## Objetivo

Verificar se o sistema impede o cadastro de produto quando o campo **Nome do produto** contém 2 caracteres, valor abaixo do limite mínimo de 3 caracteres definido na RN-001.

## Pré-condições
- Aplicação disponível em ambiente de desenvolvimento local.
- Backend/API em execução.
- Tela **Cadastrar Produto** aberta.
- SKU 'CAM-VO-P' não cadastrado previamente no banco de dados.

## Massa de teste
| Campo              | Valor         |
| ------------------ | ------------- |
| Nome do produto    | `CA`          |
| Cor                | `VERDE OLIVA` |
| Tamanho            | `P`           |
| SKU                | `CAM-VO-P`    |
| Preço              | `69.90`       |
| Quantidade inicial | `0`           |
| Estoque mínimo     | `10`          |

## Passos e resultados esperados
1. Acessar a aplicação Estoque QA Lab.
2. Navegar até a tela **Cadastrar Produto**.
3. Confirmar no banco de dados que o SKU definido na massa de teste não está cadastrado.
4. Preencher o formulário conforme a massa de teste.
5. Clicar em **Cadastrar produto**.
6. Consultar novamente no banco de dados o SKU utilizado na execução.

## Resultado esperado: 
- O sistema deve impedir a conclusão do cadastro
- O sistema deve exibir a mensagem 'Informe um nome de produto válido'.
- Nenhum registro correspondente ao SKU utilizado deve ser persistido no banco de dados


## Resultado obtido
- O sistema impediu a conclusão do cadastro.
- A mensagem 'Informe um nome de produto válido' foi exibida como esperado.
-  Após a execução, a consulta pelo SKU 'CAM-VO-P' retornou **0 registros**, confirmando que o produto não foi persistido.

## Status
**Passou**

## Evidências
- **EVD-001 — Pré-condição:** consulta no banco antes da execução, confirmando que o SKU `CAM-VO-P` não estava cadastrado.  
  [Ver evidência](../../evidencias/ct-ui-001/01-pre-condicao-banco.png)

- **EVD-002 — Massa de teste:** formulário preenchido com os dados utilizados na execução.  
  [Ver evidência](../../evidencias/ct-ui-001/02-massa-teste-ui.png)

- **EVD-003 — Validação UI:** sistema bloqueando o cadastro e exibindo a mensagem `Informe um nome de produto válido.`  
  [Ver evidência](../../evidencias/ct-ui-001/03-bloqueio-nome-abaixo-minimo.png)

- **EVD-004 — Pós-condição:** consulta no banco após a execução retornando 0 registros para o SKU `CAM-VO-P`.  
  [Ver evidência](../../evidencias/ct-ui-001/04-pos-condicao-banco.png)