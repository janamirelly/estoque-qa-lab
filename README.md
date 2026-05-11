# Estoque QA Lab

Projeto prático de Quality Assurance aplicado a um módulo de controle de estoque.

Este projeto simula um ambiente simples de estoque para demonstrar, na prática, a criação de regras de negócio, critérios de aceite, testes funcionais, testes de API, validação em banco de dados e registro de evidências.

> Projeto desenvolvido para portfólio QA, com foco em demonstrar raciocínio de teste, análise de regra de negócio e validação de comportamento do sistema.

---

## O que este projeto demonstra

Este projeto foi criado para evidenciar habilidades iniciais em QA, como:

- interpretação de regras de negócio;
- escrita de critérios de aceite;
- criação de cenários de teste em Gherkin;
- execução de testes funcionais;
- testes de API com Postman;
- validação de status code e mensagens de erro;
- conferência de dados no banco com SQL;
- identificação de bugs e inconsistências;
- registro de evidências de teste.

O foco não é apresentar um sistema complexo, mas demonstrar uma rotina realista de validação de qualidade em um módulo de estoque.

---

## Contexto do sistema

O Estoque QA Lab é um sistema simples, sem login, voltado para controle de produtos, variações, movimentações e alertas de estoque.

O módulo foi pensado para simular situações comuns em sistemas de varejo, como cadastro de produtos, controle de SKU, entrada e saída de estoque, estoque mínimo e alertas operacionais.

---

## Funcionalidades do módulo

- Dashboard de estoque;
- Cadastro de produtos;
- Cadastro de variações;
- Consulta de estoque;
- Movimentação de entrada, saída e ajuste;
- Alertas de estoque mínimo;
- Histórico de movimentações.

---

## Regras de negócio validadas

Algumas regras trabalhadas no projeto:

- produto deve possuir nome obrigatório e válido;
- produto não deve ser cadastrado em duplicidade;
- variação deve possuir SKU obrigatório e único;
- variação deve possuir cor, tamanho, preço e estoque mínimo;
- preço deve ser maior que R$ 0,00;
- estoque mínimo deve respeitar o limite definido;
- saída de estoque não deve permitir quantidade negativa;
- toda movimentação deve gerar registro no histórico;
- produtos abaixo do estoque mínimo devem aparecer na seção de alertas.

---

## Estratégia de QA

A validação do projeto segue o fluxo:

```txt
Regra de negócio
→ Critério de aceite
→ Cenário de teste
→ Execução
→ Evidência
→ Bug, ajuste ou aprovação

## Entregavéis de QA

Este projeto reúne artefatos usados em uma rotina de QA, como:

- regras de negócio documentadas;
- critérios de aceite em formato Given/When/Then;
- cenários de teste positivos e negativos;
- validações de API no Postman;
- consultas SQL para conferência dos dados;
- evidências de execução;
- registros de bugs e inconsistências encontrados.

## Ferramentas e tecnologias utilizadas

- Postman — testes de API e validação de respostas;
- SQL / SQLite — conferência de dados e persistência;
- Gherkin — escrita de cenários de teste;
- JavaScript — apoio no frontend e automação inicial;
- Node.js / Express — API utilizada como base para os testes;
- HTML / CSS — interface do módulo de estoque.