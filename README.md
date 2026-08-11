# Estoque QA Lab

Projeto prático de **Quality Assurance aplicado a um módulo de controle de estoque**, criado para demonstrar análise de regras de negócio, planejamento e execução de testes, validações de API e banco de dados, documentação de evidências e automação de cenários funcionais.

O projeto utiliza um módulo de estoque derivado do contexto do **VarejoSync**, sistema voltado ao varejo, como ambiente controlado para aplicação de práticas de QA.

> O objetivo não é demonstrar a complexidade da aplicação, mas evidenciar o processo de qualidade aplicado sobre comportamentos reais de um sistema.

---

## Objetivo do projeto

O Estoque QA Lab foi desenvolvido como ambiente de prática para aplicar um fluxo de QA próximo ao utilizado em projetos reais:

```text
Regra de negócio
        ↓
Critério de aceite
        ↓
Cenário de teste
        ↓
Execução
        ↓
Validação de resultado
        ↓
Evidência
        ↓
Bug, ajuste ou aprovação
```

As validações não ficam restritas à interface.

Quando necessário, o comportamento é investigado entre diferentes camadas da aplicação:

```text
Interface
   ↓
API
   ↓
Banco de dados
```

Essa abordagem permite verificar não apenas o comportamento apresentado ao usuário, mas também respostas da API e persistência dos dados.

---

## Contexto do sistema

O módulo simula operações comuns de estoque em sistemas de varejo.

A aplicação não possui autenticação e concentra funcionalidades relacionadas ao cadastro de produtos, variações, movimentações e acompanhamento de estoque.

### Principais funcionalidades

* dashboard de estoque;
* cadastro de produtos;
* cadastro de variações;
* consulta de produtos e estoque;
* edição de produtos;
* exclusão de produtos;
* movimentações de entrada;
* movimentações de saída;
* ajustes de estoque;
* controle de estoque mínimo;
* alertas operacionais;
* histórico de movimentações.

---

## Estratégia de QA

Os testes são elaborados a partir das regras de negócio e critérios de aceite definidos para cada funcionalidade.

A cobertura contempla, conforme aplicável:

* cenários positivos;
* cenários negativos;
* campos obrigatórios;
* valores inválidos;
* limites;
* duplicidade de dados;
* normalização de informações;
* persistência no banco de dados;
* respostas e status codes da API;
* consistência entre frontend, API e banco;
* mensagens apresentadas ao usuário;
* regressão de comportamentos corrigidos.

O objetivo é validar tanto o **resultado funcional** quanto a **integridade do comportamento entre as camadas do sistema**.

---

## Regras de negócio

Entre as regras analisadas e validadas no projeto estão:

| ID   | Regra de negócio                                                                               |
| ---- | ---------------------------------------------------------------------------------------------- |
| RN01 | O nome do produto é obrigatório.                                                               |
| RN02 | A variação deve possuir SKU.                                                                   |
| RN03 | O SKU da variação deve ser único.                                                              |
| RN04 | Antes da comparação, espaços no início e no fim do SKU devem ser removidos.                    |
| RN05 | A comparação de SKU deve considerar o valor normalizado em letras maiúsculas.                  |
| RN06 | A variação deve possuir cor e tamanho válidos.                                                 |
| RN07 | O preço deve ser maior que R$ 0,00.                                                            |
| RN08 | O estoque mínimo não deve aceitar valores inválidos.                                           |
| RN09 | Uma saída de estoque não deve resultar em saldo inválido.                                      |
| RN10 | Toda movimentação realizada deve gerar registro no histórico.                                  |
| RN11 | Produtos que atendam à condição definida de estoque mínimo devem ser apresentados nos alertas. |

As regras são detalhadas na documentação do projeto e utilizadas como base para definição dos respectivos critérios de aceite e cenários de teste.

---

## Exemplo de regra analisada — unicidade do SKU

Uma das regras trabalhadas com maior profundidade foi a validação de **unicidade do SKU da variação**.

A comparação não considera apenas o texto digitado literalmente.

Antes da validação, o sistema deve:

1. remover espaços existentes no início e no fim;
2. converter o valor para letras maiúsculas;
3. comparar o SKU normalizado com os registros existentes.

Exemplo:

| Entrada       | Condição                        | Resultado esperado |
| ------------- | ------------------------------- | ------------------ |
| `CAM-PRETO-G` | SKU inexistente                 | Cadastro permitido |
| `CAM-AZUL-M`  | SKU já existente                | Cadastro rejeitado |
| `cam-azul-m`  | Mesmo SKU com letras minúsculas | Cadastro rejeitado |
| `CAM-AZUL-M`  | Mesmo SKU com espaços externos  | Cadastro rejeitado |

Em caso de duplicidade, a API deve impedir a criação do novo registro e retornar a resposta definida para conflito de recurso.

Exemplo:

```text
HTTP 409 Conflict
SKU já cadastrado para outra variação
```

Essa regra permite explorar diferentes técnicas de teste, principalmente:

* particionamento de equivalência;
* testes negativos;
* variações de entrada;
* normalização de dados;
* validação de duplicidade;
* integração entre API e banco de dados.

---

## Cenários de teste

Os casos de teste são derivados das regras de negócio e dos critérios de aceite.

Entre os cenários já trabalhados estão:

### Cadastro

* acesso à tela de cadastro;
* cadastro com dados válidos;
* tentativa de cadastro sem SKU;
* tentativa de cadastro com SKU duplicado;
* validação de normalização do SKU;
* validação das mensagens apresentadas após cadastro.

### Edição

* busca de produto existente;
* alteração de dados;
* persistência das alterações;
* validação da mensagem de sucesso.

### Exclusão

* exclusão pela aplicação/API;
* validação do retorno da operação;
* consulta posterior no banco;
* validação da atualização da interface.

### Estoque

* movimentação de entrada;
* movimentação de saída;
* ajuste de quantidade;
* conferência do saldo após movimentação;
* histórico da operação;
* comportamento dos alertas de estoque.

---

## Critérios de aceite e Gherkin

Parte dos comportamentos é documentada utilizando **Given / When / Then**, permitindo transformar regras de negócio em condições objetivamente testáveis.

Exemplo simplificado:

```gherkin
Cenário: Impedir cadastro de SKU já existente

Dado que existe uma variação cadastrada com o SKU "CAM-AZUL-M"
Quando uma nova variação for cadastrada com o SKU "cam-azul-m"
Então o sistema deve normalizar o SKU informado
E impedir o novo cadastro
E informar que o SKU já está cadastrado para outra variação
```

O uso de Gherkin neste projeto tem como objetivo melhorar a rastreabilidade entre:

```text
Regra de negócio
→ Critério de aceite
→ Cenário
→ Teste
```

---

## Testes funcionais

Os testes funcionais verificam o comportamento da aplicação sob a perspectiva do usuário.

São avaliados pontos como:

* disponibilidade das funcionalidades;
* preenchimento de formulários;
* obrigatoriedade de campos;
* mensagens de feedback;
* comportamento após cadastro;
* comportamento após edição;
* comportamento após exclusão;
* atualização das informações apresentadas na interface.

Quando um resultado da interface não é suficiente para determinar a origem de uma falha, a análise continua pela API e pelo banco de dados.

---

## Testes de API

A API do módulo é validada com **Postman**.

As verificações incluem:

* método HTTP;
* endpoint;
* status code;
* payload enviado;
* corpo da resposta;
* mensagens de erro;
* criação e alteração de recursos;
* exclusão de registros;
* comportamento em cenários inválidos;
* conflito de dados;
* consistência entre resposta da API e persistência.

Entre os status codes analisados estão, conforme o comportamento do endpoint:

```text
200 OK
201 Created
400 Bad Request
409 Conflict
```

A validação não se limita ao status code. O conteúdo da resposta e o estado resultante no sistema também são conferidos.

---

## Validação em banco de dados

O projeto utiliza **SQLite** para persistência.

Consultas SQL são utilizadas como apoio à investigação e validação dos testes.

Exemplos de verificações:

* confirmação de criação de registros;
* consulta de produto por SKU;
* confirmação de alteração;
* confirmação de exclusão;
* análise de variações cadastradas;
* conferência de estoque;
* consulta do histórico de movimentações;
* investigação de inconsistências entre interface e persistência.

Exemplo:

```sql
SELECT *
FROM variacao_produto
WHERE sku = 'CAM-AZUL-M';
```

O banco de dados é utilizado como uma camada adicional de evidência, principalmente quando existe diferença entre o comportamento observado na interface e o resultado processado pela aplicação.

---

## Exemplo de investigação de bug

Durante os testes do fluxo de exclusão foi identificado um comportamento inconsistente entre as camadas da aplicação.

### Comportamento observado

Após a exclusão de um produto, ele continuava sendo apresentado na interface.

### Investigação

A validação foi realizada em três pontos:

```text
1. API
   ↓
A requisição de exclusão foi processada com sucesso.

2. Banco de dados
   ↓
O registro já não estava presente.

3. Interface
   ↓
O produto continuava sendo exibido.
```

### Conclusão

Como a API havia processado corretamente a exclusão e o registro já não existia no banco, a inconsistência estava relacionada à atualização dos dados apresentados pelo frontend.

Esse tipo de investigação é utilizado no projeto para evitar classificar um problema apenas pelo sintoma apresentado ao usuário.

---

## Automação de testes

Parte dos cenários funcionais também é utilizada para prática de automação.

### Stack

* Java;
* Selenium WebDriver;
* JUnit;
* IntelliJ IDEA.

Entre os fluxos automatizados estão:

* validação da tela inicial;
* cadastro de produto com dados válidos;
* edição de produto;
* validação de mensagens de sucesso;
* cenário negativo com SKU obrigatório;
* validação de comportamentos associados ao cadastro.

A automação é aplicada de forma incremental, priorizando cenários estáveis e relevantes para regressão.

Exemplo de fluxo:

```text
Abrir aplicação
→ acessar cadastro
→ preencher dados
→ executar ação
→ aguardar resposta da interface
→ validar resultado esperado
```

São utilizadas esperas explícitas e assertions para reduzir dependência de tempo fixo e tornar os testes mais previsíveis.

---

## Evidências de teste

As execuções são documentadas com evidências que permitem comprovar o comportamento observado durante os testes.

Dependendo do cenário, podem ser registradas evidências de:

* interface;
* requisição e resposta da API;
* consultas SQL;
* mensagens de erro;
* comportamento esperado;
* comportamento obtido;
* bugs identificados;
* validação após correção.

O objetivo da evidência não é apenas registrar uma captura de tela, mas permitir que outra pessoa compreenda **o que foi testado, qual era o resultado esperado e o que efetivamente aconteceu**.

---

## Bug reports

Os defeitos identificados são documentados de forma reproduzível.

Um registro pode conter:

* título objetivo;
* ambiente;
* pré-condições;
* passos para reprodução;
* resultado esperado;
* resultado obtido;
* severidade;
* prioridade, quando aplicável;
* evidências;
* informações adicionais da API ou banco de dados.

Essa estrutura facilita a comunicação do problema e sua investigação técnica.

---

## Entregáveis de QA

O repositório reúne artefatos produzidos durante o processo de qualidade, incluindo:

* regras de negócio;
* critérios de aceite;
* cenários em Gherkin;
* casos de teste;
* testes positivos e negativos;
* testes de API;
* consultas SQL;
* evidências de execução;
* bug reports;
* testes automatizados.

Esses artefatos buscam demonstrar não apenas a execução de testes, mas também o raciocínio utilizado para definir **o que testar, por que testar e como validar o resultado**.

---

## Tecnologias e ferramentas

### Quality Assurance

* **Postman** — testes e investigação de API;
* **SQL / SQLite** — validação de persistência e integridade dos dados;
* **Gherkin** — especificação de cenários;
* **Java** — implementação dos testes automatizados;
* **Selenium WebDriver** — automação dos fluxos funcionais;
* **JUnit** — estrutura e execução dos testes;
* **IntelliJ IDEA** — desenvolvimento da automação;
* **Git / GitHub** — versionamento e documentação.

### Aplicação utilizada nos testes

* **HTML**;
* **CSS**;
* **JavaScript**;
* **Node.js**;
* **Express**;
* **SQLite**.

As tecnologias da aplicação são apresentadas separadamente das ferramentas utilizadas no processo de QA para deixar claro o papel de cada stack dentro do projeto.

---

## Abordagens aplicadas

Ao longo do projeto são trabalhados conceitos como:

* análise de requisitos;
* análise de regras de negócio;
* critérios de aceite;
* testes funcionais;
* testes positivos e negativos;
* particionamento de equivalência;
* validação de limites;
* testes de API;
* validação de persistência;
* testes entre camadas;
* investigação de defeitos;
* documentação de bugs;
* evidências de teste;
* automação de regressão.

---

## Processo de investigação

Quando uma inconsistência é encontrada, o objetivo é evitar concluir imediatamente que determinado componente é responsável pelo problema.

A análise segue, quando aplicável:

```text
Reproduzir o comportamento
        ↓
Validar dados utilizados
        ↓
Analisar resposta da interface
        ↓
Verificar API
        ↓
Consultar banco de dados
        ↓
Comparar resultados
        ↓
Isolar a possível origem
        ↓
Documentar evidências
```

Essa abordagem foi utilizada em problemas reais encontrados durante a evolução do módulo.

---

## O que este projeto demonstra

O Estoque QA Lab busca demonstrar capacidade prática para:

* compreender comportamentos esperados;
* analisar regras de negócio;
* transformar requisitos em cenários testáveis;
* elaborar testes positivos e negativos;
* executar testes funcionais;
* validar APIs REST;
* interpretar status codes e respostas;
* utilizar SQL como apoio à validação;
* investigar inconsistências entre camadas;
* registrar bugs de forma reproduzível;
* produzir evidências;
* iniciar automação de cenários de regressão.

---

## Evolução do projeto

O projeto continua sendo utilizado como laboratório para evolução das práticas de QA.

Entre os pontos trabalhados progressivamente estão:

* ampliação da cobertura de cenários negativos;
* refinamento das regras de negócio;
* melhoria da documentação;
* aumento da cobertura de API;
* novas validações em banco de dados;
* evolução dos testes automatizados;
* organização das evidências;
* criação de cenários de regressão a partir de bugs encontrados.

---

## Sobre o projeto

Este repositório faz parte do meu portfólio de **Quality Assurance** e foi estruturado para representar minha evolução prática em testes de software.

Mais do que reunir ferramentas, o objetivo é demonstrar o processo utilizado para analisar um comportamento, definir condições de teste, executar validações, investigar inconsistências e documentar os resultados.
