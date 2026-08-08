## CT01 - Bloquear cadastro com nome do produto vazio

## Identificação

- **Módulo:** Estoque
- **Funcionalidade:** Cadastro de produto
- **Camada:** UI
- **Tipo de teste:** Funcional negativo
- **Técnica de teste:** Análise de Valor Vazio
- **Regra relacionada:** RN-01 — Nome do produto deve ser obrigatório e válido
- **Critério de aceite relacionado:** CA-01 — Bloquear cadastro com nome abaixo do limite mínimo
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
| Nome do produto    | ``          |
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