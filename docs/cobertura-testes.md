# Cobertura de Testes

## 1. Catálogo de casos de teste

| ID   | Funcionalidade | Cenário                                  | Tipo     | Automação | Status |
| ---- | -------------- | ---------------------------------------- | -------- | --------- | ------ |
| CT01 | Cadastro       | Bloquear nome vazio                      | Negativo | Sim       | Passou |
| CT02 | Cadastro       | Bloquear SKU vazio                       | Negativo | Sim       | Passou |
| CT03 | Cadastro       | Bloquear nome com 2 caracteres           | Negativo | Sim       | Passou |
| CT04 | Cadastro       | Cadastrar produto válido                 | Positivo | Sim       | Passou |
| CT05 | Edição         | Alterar estoque mínimo da variação       | Positivo | Sim       | Passou |
| CT06 | Exclusão       | Excluir produto existente                | Positivo | Sim       | Passou |

## 2. Cobertura da RN-001 — Nome do produto deve ser obrigatório e válido

| Condição da regra                                    | Técnica | Caso de teste                | Situação                              |
| ---------------------------------------------------- | ------- | ---------------------------- | ------------------------------------- |
| Nome obrigatório                                     | PE      | CT01 — Nome vazio            | Executado e automatizado              |
| Nome com menos de 3 caracteres                       | AVL     | CT03 — Nome com 2 caracteres | Executado, documentado e automatizado |
| Nome com exatamente 3 caracteres                     | AVL     | A criar                      | Planejado                             |
| Nome com exatamente 30 caracteres                    | AVL     | A criar                      | Planejado                             |
| Nome com mais de 30 caracteres                       | AVL     | A criar                      | Planejado                             |
| Nome deve conter pelo menos uma letra                | PE      | A criar — somente números    | Planejado                             |
| Espaços no início e no fim devem ser desconsiderados | PE      | A criar                      | Planejado                             |