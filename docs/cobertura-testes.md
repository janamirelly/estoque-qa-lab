# Cobertura de Testes

Este documento consolida a cobertura dos casos de teste do módulo de Estoque do VarejoSync e sua rastreabilidade com as Regras de Negócio (RN), Critérios de Aceite (CA) e testes automatizados.

## 1. Convenção de identificação dos casos de teste

Os casos de teste seguem o padrão:

`CT-[MÓDULO]-[FUNCIONALIDADE]-[SEQUÊNCIA]`

Onde:

* `CT` — Caso de Teste
* `EST` — Módulo de Estoque
* `CAD` — Cadastro
* `EDT` — Edição
* `EXC` — Exclusão/Inativação
* `NAV` — Navegação
* `001` — Número sequencial dentro da funcionalidade

Exemplos:

* `CT-EST-CAD-001`
* `CT-EST-EDT-001`
* `CT-EST-EXC-001`

## 2. Catálogo de casos de teste

| ID             | RN     | CA     | Funcionalidade      | Cenário                             | Tipo     | Automação | Status  |
| -------------- | ------ | ------ | ------------------- | ----------------------------------- | -------- | --------- | ------- |
| CT-EST-CAD-001 | RN-001 | CA-001 | Cadastro            | Bloquear nome vazio                 | Negativo | Sim       | Passou* |
| CT-EST-CAD-002 | RN-004 | CA-004 | Cadastro            | Bloquear SKU vazio                  | Negativo | Sim       | Passou* |
| CT-EST-CAD-003 | RN-001 | CA-001 | Cadastro            | Bloquear nome com 2 caracteres      | Negativo | Sim       | Passou* |
| CT-EST-CAD-004 | RN-010 | CA-010 | Cadastro            | Cadastrar produto com dados válidos | Positivo | Sim       | Passou* |
| CT-EST-EDT-001 | RN-011 | CA-011 | Edição              | Alterar estoque mínimo da variação  | Positivo | Sim       | Passou* |
| CT-EST-EXC-001 | —      | —      | Exclusão/Inativação | Excluir produto existente           | Positivo | Sim       | Passou* |

> **Observação:** o status de execução está registrado manualmente neste documento. A evolução prevista é obter o resultado diretamente do relatório de execução automatizada, com identificação da execução e data correspondente.

> **Lacuna de especificação:** `CT-EST-EXC-001` possui automação, porém ainda não possui Regra de Negócio nem Critério de Aceite formalmente definidos para o comportamento de exclusão/inativação.

## 3. Cobertura da RN-001 — Nome do produto obrigatório e válido

**Critério de Aceite relacionado:** `CA-001`

| Condição da regra                                    | Técnica | Caso de teste                          | Situação                              |
| ---------------------------------------------------- | ------- | -------------------------------------- | ------------------------------------- |
| Nome obrigatório                                     | PE      | CT-EST-CAD-001 — Nome vazio            | Executado e automatizado              |
| Nome com menos de 3 caracteres                       | AVL     | CT-EST-CAD-003 — Nome com 2 caracteres | Executado, documentado e automatizado |
| Nome com exatamente 3 caracteres                     | AVL     | Não criado                             | Planejado                             |
| Nome com exatamente 30 caracteres                    | AVL     | Não criado                             | Planejado                             |
| Nome com mais de 30 caracteres                       | AVL     | Não criado                             | Planejado                             |
| Nome deve conter pelo menos uma letra                | PE      | Não criado — somente números           | Planejado                             |
| Espaços no início e no fim devem ser desconsiderados | PE      | Não criado                             | Planejado                             |

### Técnicas utilizadas

* **PE — Particionamento de Equivalência:** divisão das entradas em grupos que devem apresentar comportamento equivalente.
* **AVL — Análise de Valor Limite:** validação dos valores localizados nos limites definidos pela regra e imediatamente ao redor deles.

## 4. Situação atual da cobertura

A `RN-001` possui cobertura automatizada parcial.

Atualmente estão automatizadas as condições:

* obrigatoriedade do nome;
* nome abaixo do limite mínimo de 3 caracteres.

Permanecem planejadas as validações referentes a:

* limite mínimo válido de 3 caracteres;
* limite máximo válido de 30 caracteres;
* valor acima do limite máximo;
* obrigatoriedade de pelo menos uma letra;
* tratamento de espaços no início e no fim do nome.

A cobertura será ampliada progressivamente à medida que os respectivos casos de teste forem especificados, documentados e automatizados.
