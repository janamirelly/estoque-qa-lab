# VarejoSync — Módulo de Estoque | Portfólio QA

Portfólio de Quality Assurance desenvolvido sobre o módulo de estoque do **VarejoSync**, uma aplicação web voltada à gestão de varejo.

O projeto demonstra a aplicação prática de testes funcionais, análise de regras de negócio, critérios de aceite, documentação de casos de teste, investigação de defeitos, validações em banco de dados e automação de interface com Java, Selenium WebDriver e JUnit.

A estratégia de testes utiliza rastreabilidade entre:

`Regra de Negócio → Critério de Aceite → Caso de Teste → Execução → Evidência`

---

## Destaques do portfólio

| Artefato | Conteúdo |
| --- | --- |
| [Cobertura de testes](./docs/cobertura-testes.md) | Matriz RN → CA → CT, cobertura atual e gaps |
| [Caso de teste — Cadastro válido](./docs/casos-de-teste/cadastro-produto/CT-EST-CAD-004-cadastrar-produto-valido.md) | Fluxo positivo de cadastro e persistência |
| [Caso de teste — Vínculo produto/variações](./docs/casos-de-teste/variacao-produto/CT-EST-VAR-001-vincular-variacoes-mesmo-produto.md) | Validação do relacionamento entre produto e variações |
| [Caso de teste — Inativação de variação](./docs/casos-de-teste/inativacao-variacao/CT-EST-EXC-001-inativar-variacao.md) | Inativação lógica individual e reteste de defeito |
| [BUG-001 — Vínculo incorreto entre produto e variações](./docs/bugs/bug-001-variacoes-mesmo-produto-ids-distintos.md) | Investigação do relacionamento de dados |
| [BUG-002 — Inativação indevida do produto](./docs/bugs/bug-002-inativacao-variacao-inativa-produto.md) | Defeito investigado, corrigido e retestado |
| [Automação — Java, Selenium e JUnit](./selenium-tests/testes-estoque-qa-lab) | Testes automatizados de interface e validação em banco |

---

## Cobertura atual

| Indicador | Situação |
| --- | ---: |
| Regras de Negócio formalizadas | 13 |
| Critérios de Aceite formalizados | 13 |
| RNs com pelo menos um CT executado | 6 de 13 |
| Cobertura por RN | ~46% |
| Casos de teste funcionais catalogados | 7 |
| Casos funcionais automatizados | 7 |
| Casos funcionais documentados | 7 |
| Testes de navegação / smoke | 2 |
| Total de testes automatizados identificados | 9 |

A porcentagem de cobertura por RN representa regras que possuem ao menos um caso de teste formalmente associado e executado.

Ela **não representa cobertura exaustiva de todas as combinações possíveis**.

[Ver matriz de cobertura completa](./docs/cobertura-testes.md)

---

## Funcionalidades validadas

| Área | Cobertura desenvolvida |
| --- | --- |
| Cadastro | nome obrigatório, limite mínimo e cadastro com dados válidos |
| SKU | obrigatoriedade do campo |
| Edição | alteração e persistência do estoque mínimo |
| Produto / variações | vínculo de múltiplas variações ao mesmo produto |
| Inativação | inativação lógica somente da variação selecionada |
| Banco de dados | persistência, estado dos registros e relacionamento entre entidades |
| Navegação | tela inicial e acesso ao cadastro pelo menu |
| Investigação de defeitos | análise de comportamento entre UI, backend e banco |

As demais condições das regras de SKU e outras regras ainda não cobertas estão explicitamente registradas no documento de cobertura.

---

## Estratégia de testes

Os testes são elaborados a partir das regras de negócio e critérios de aceite.

```text
Regra de Negócio
        ↓
Critério de Aceite
        ↓
Caso de Teste
        ↓
Execução
        ↓
Resultado esperado x obtido
        ↓
Evidência