# VarejoSync — Módulo de Estoque | Portfólio QA

Portfólio de QA desenvolvido sobre o módulo de estoque do VarejoSync, com validações funcionais, testes de API REST, consultas SQL e automação de interface.

A cobertura atual inclui cadastro e edição de produtos, regras de SKU, exclusão e investigação de inconsistências entre frontend, API e banco de dados.

---

## Destaques do portfólio

- [Cobertura de testes](./docs/cobertura-testes.md)
- [Caso de teste — Cadastro de produto](./docs/casos-de-teste/cadastro-produto.md)
- [Regra de negócio — Cadastro e SKU](./docs/regras-negocio/cadastro-produto.md)
- [Bug report — Variações vinculadas a produtos distintos](./docs/bugs/bug-001-variacoes-mesmo-produto-ids-distintos.md)
- [Automação de interface — Java, Selenium e JUnit](./selenium-tests/testes-estoque-qa-lab)

## O que foi testado

| Área | Cobertura desenvolvida |
| --- | --- |
| Cadastro | cadastro válido, campos obrigatórios, mensagem e persistência |
| SKU | formato, obrigatoriedade, normalização e duplicidade |
| Edição | busca, alteração, salvamento e resultado |
| Exclusão | API, banco de dados e comportamento do frontend |
| API | requisições, respostas, status HTTP e regras de negócio |
| Banco de dados | persistência, consulta por SKU, alteração, exclusão e investigação |
| Automação | tela inicial, cadastro positivo, edição e cenário negativo |

Funcionalidades de movimentação, histórico e alertas também fazem parte do módulo, mas ainda não representam o foco principal da cobertura.

## Visualização do sistema

O módulo possui uma interface web utilizada na execução dos testes funcionais e automatizados.

### Dashboard de estoque

![Dashboard de estoque do VarejoSync](assets/screenshots/dashboard-estoque.png)

### Consulta de estoque

![Consulta de produtos, variações e saldos](assets/screenshots/consulta-estoque.png)

### Cadastro de produto

![Cadastro de produto e variação](assets/screenshots/cadastro-produto.png)


### Interface

> **A aplicação ainda não possui uma demonstração pública.**
>
> As evidências visuais dos testes permitem consultar o comportamento da interface, API e banco de dados. O próximo passo do projeto é disponibilizar o módulo em ambiente acessível pelo navegador.

---

## Contexto da aplicação

O **VarejoSync** é um sistema web voltado à gestão de varejo. Este repositório concentra a validação do módulo de estoque.

O módulo contempla cadastro e consulta de produtos e variações, edição, movimentações de entrada, saída e ajuste, alertas de estoque mínimo, histórico de movimentações e operações de exclusão pela API.

A cobertura apresentada neste portfólio está concentrada nas funcionalidades já validadas e documentadas no repositório.

A aplicação não possui autenticação.

---

## Estratégia de validação

Os cenários partem das regras de negócio definidas para cada comportamento.

```text
Regra de negócio
        ↓
Critério de aceite
        ↓
Cenário de teste
        ↓
Execução
        ↓
Resultado esperado x resultado obtido
        ↓
Evidência
```

Quando o resultado apresentado na interface não é suficiente para determinar o comportamento da aplicação, a investigação continua pelas demais camadas:

```text
Frontend
   ↓
API
   ↓
Banco de dados
```

Esse fluxo também é utilizado quando uma validação exige verificar o comportamento além da interface, como em testes de persistência, exclusão e relacionamento entre produto e variações.

---

## Regra de negócio em destaque — unicidade do SKU

Uma das regras analisadas com maior profundidade no projeto é a unicidade do SKU das variações.

Antes da comparação, o sistema deve:

1. remover espaços no início e no fim do SKU;
2. converter o valor para letras maiúsculas;
3. comparar o SKU normalizado com os registros existentes.

### Exemplos

| Entrada       | Condição                       | Resultado esperado |
| ------------- | ------------------------------ | ------------------ |
| `CAM-PRETO-G` | SKU não cadastrado             | aceitar            |
| `CAM-AZUL-M`  | SKU já cadastrado              | rejeitar           |
| `cam-azul-m`  | mesmo SKU em minúsculas        | rejeitar           |
| `CAM-AZUL-M`  | mesmo SKU com espaços externos | rejeitar           |

Quando o SKU normalizado já estiver associado a outra variação, o cadastro deve ser bloqueado.

```text
409 Conflict
SKU já cadastrado para outra variação
```

A validação diferencia erro de entrada de conflito com um registro já existente.

Um SKU fora do formato definido deve ser tratado como entrada inválida. Já um SKU válido em formato, mas existente após a normalização, deve ser tratado como conflito de negócio.

---

### Exemplo em Gherkin

```gherkin
Cenário: Impedir cadastro de SKU já existente

Dado que existe uma variação cadastrada com o SKU "CAM-AZUL-M"
Quando for realizado um novo cadastro com o SKU "cam-azul-m"
Então o sistema deve normalizar o valor informado
E identificar que o SKU já está cadastrado
E impedir o novo cadastro
E retornar a mensagem de duplicidade
```

Os cenários em Gherkin são utilizados para documentar comportamentos esperados. A automação não depende diretamente desses arquivos.

---

## Testes de API

Os endpoints do módulo são validados com **Postman**.

As verificações incluem:

- método e endpoint;
- payload da requisição;
- status HTTP;
- corpo e mensagens da resposta;
- criação e alteração de registros;
- entradas inválidas e conflitos de negócio;
- exclusão;
- estado do recurso após a operação.

Entre os retornos analisados estão:

```text
200 OK
201 Created
400 Bad Request
409 Conflict
```

O status HTTP não é utilizado isoladamente para determinar o resultado do teste.

A resposta é comparada com a regra de negócio e, quando necessário, o estado resultante da operação também é validado no banco de dados.

---

## Validação em banco de dados

O módulo utiliza **SQLite**, consultado durante os testes para confirmar o estado dos dados e apoiar a investigação de inconsistências.

As validações realizadas incluem:

- consulta por SKU;
- confirmação de persistência após cadastro;
- conferência dos dados após alteração;
- confirmação de exclusão;
- investigação de registros duplicados;
- consulta de dados relacionados ao estoque.

### Exemplo

```sql
SELECT *
FROM variacao_produto
WHERE sku = 'CAM-AZUL-M';
```

A consulta ao banco complementa a validação funcional quando é necessário comparar o comportamento apresentado no frontend com o estado persistido após uma operação da API.

---

## Bug investigado — variações vinculadas a produtos distintos

Durante os testes de cadastro de variações, foi identificada uma inconsistência no relacionamento entre produto e variação.

### Resultado obtido

Ao cadastrar diferentes variações de um mesmo produto, cada variação era associada a um `id_produto` diferente no banco de dados.

| Produto | SKU | id_produto |
| --- | --- | ---: |
| Calça Jeans | `CAL-PRETA-P` | 10 |
| Calça Jeans | `CAL-PRETA-M` | 13 |
| Calça Jeans | `CAL-PRETA-G` | 11 |

### Resultado esperado

As variações pertencentes ao mesmo produto deveriam permanecer associadas ao mesmo `id_produto`, mantendo identificadores próprios apenas para cada variação.

### Investigação

A análise comparou as informações apresentadas na interface com o relacionamento persistido no banco de dados:

```text
Cadastro das variações
        ↓
Consulta na interface
        ↓
Consulta SQL com JOIN
        ↓
Comparação dos id_produto
        ↓
Inconsistência identificada

```
A consulta confirmou que variações pertencentes ao mesmo produto estavam associadas a registros diferentes na tabela de produtos.

### Impacto

A inconsistência poderia afetar operações dependentes do relacionamento entre produto e variações, como:

edição;
exclusão/inativação;
agrupamento das variações;
consulta de estoque;
movimentações;
relatórios.

### Validação da correção

Após o ajuste, o cenário foi executado novamente com duas variações do produto Blusa Canelada:

BLU-PRETA-P;
BLU-PRETA-M.

A consulta no banco confirmou que ambas passaram a utilizar o mesmo id_produto.

**Resultado do reteste: aprovado.**

[Ver bug report completo](./docs/bugs/bug-001-variacoes-mesmo-produto-ids-distintos.md)

### Evidências

- [Evidência 1 — Interface](./docs/evidencias/bug-001/01-variacoes-mesmo-produto-ui.png)
- [Evidência 2 — Banco de dados](./docs/evidencias/bug-001/02-ids-produto-distintos-banco.png)
- [Evidência 3 — Correção validada](./docs/evidencias/bug-001/03-correcao-validada-banco.png)


---

## Automação de interface

Parte da cobertura funcional do módulo foi automatizada com **Java, Selenium WebDriver e JUnit**.

Os testes automatizados foram desenvolvidos a partir de cenários funcionais previamente executados e conhecidos no fluxo da aplicação.

### Cenários automatizados

| Cenário | Validação |
| --- | --- |
| Tela inicial | URL, título da página e seção ativa |
| Cadastro positivo | preenchimento de dados válidos, cadastro e mensagem retornada pela aplicação |
| Edição | busca do produto, alteração dos dados, salvamento e resultado da operação |
| Cadastro negativo | tentativa de cadastro sem SKU e validação do comportamento retornado pela aplicação |

[Ver testes automatizados](./selenium-tests/testes-estoque-qa-lab)

### Estrutura dos testes

O código de automação está separado por responsabilidades, incluindo:

- classes de teste;
- elementos da interface;
- massa de dados;
- variáveis utilizadas nos fluxos;
- acesso ao banco de dados.

São utilizadas esperas explícitas com `WebDriverWait` para aguardar condições da interface antes das validações.

As verificações dos resultados são realizadas com assertions do JUnit.

---

## Documentação e evidências

Os testes são acompanhados de registros compatíveis com o tipo de validação executada, incluindo:

- evidências da interface;
- requisições e respostas da API no Postman;
- consultas SQL;
- resultados encontrados no banco de dados;
- mensagens apresentadas pela aplicação;
- bug reports;
- casos de teste e regras de negócio.

As evidências são utilizadas para relacionar o cenário executado ao resultado esperado e ao comportamento efetivamente encontrado.

Os bugs documentados incluem informações necessárias para reprodução e análise, como:

- contexto;
- pré-condições;
- passos para reprodução;
- resultado esperado;
- resultado obtido;
- evidências;
- informações adicionais de API ou banco quando aplicáveis.

A documentação do projeto está organizada na pasta [`docs`](./docs).

---

## Tecnologias e ferramentas

### QA

| Tecnologia / ferramenta | Uso no projeto |
| --- | --- |
| Postman | testes e validações de API REST |
| SQL / SQLite | validação de persistência e investigação de dados |
| Java | implementação dos testes automatizados |
| Selenium WebDriver | automação da interface web |
| JUnit | execução dos testes e assertions |
| IntelliJ IDEA | desenvolvimento da automação |
| Git / GitHub | versionamento, documentação e publicação do portfólio |

### Aplicação testada

| Tecnologia | Uso |
| --- | --- |
| HTML | estrutura da interface |
| CSS | apresentação da aplicação |
| JavaScript | comportamento do frontend |
| Node.js | backend |
| Express | API REST |
| SQLite | persistência dos dados |

---

## Próximas áreas de cobertura

A evolução da cobertura está prevista para funcionalidades já existentes no módulo:

- movimentações de entrada;
- movimentações de saída;
- ajustes de estoque;
- histórico de movimentações;
- alertas de estoque mínimo.

Essas funcionalidades ainda não são apresentadas neste README como cobertura concluída.