# Critérios de Aceite — Cadastro de Produto

Os critérios abaixo derivam das regras de negócio do módulo de estoque e descrevem condições observáveis para aprovação funcional.

> Convenção: os termos **Dado**, **Quando**, **Então** e **E** são apresentados em linhas separadas para facilitar leitura, rastreabilidade e futura derivação de casos de teste.

---

## CA-001 — Deve bloquear o cadastro quando o nome do produto não atender à RN-001

**Regra relacionada:** RN-001 — Nome do produto deve ser obrigatório e válido

### Condições de aceite

O sistema deve considerar o nome inválido quando:

- estiver vazio;
- possuir menos de 3 caracteres após remoção de espaços no início e no fim;
- possuir mais de 30 caracteres;
- não contiver pelo menos uma letra;
- for formado apenas por números, espaços ou caracteres especiais;
- contiver caracteres não permitidos pela RN-001.

### Cenário — Nome inválido

- **Dado** que o usuário esteja na tela **Cadastrar Produto**
- **E** os demais campos obrigatórios estejam preenchidos com dados válidos
- **Quando** informar um nome que não atenda às condições da RN-001
- **E** clicar em **Cadastrar produto**
- **Então** o sistema deve impedir a conclusão do cadastro
- **E** deve exibir a mensagem `Informe um nome de produto válido.`
- **E** o produto não deve ser persistido

---

## CA-002 — Deve bloquear o cadastro quando a cor da variação não atender à RN-002

**Regra relacionada:** RN-002 — Cor da variação deve ser obrigatória e válida

### Condições de aceite

Após remover espaços no início e no fim, a cor deve:

- possuir no mínimo 3 caracteres;
- conter pelo menos uma letra;
- aceitar apenas letras, espaços, acentos e os caracteres `-` e `/`;
- não ser formada apenas por números, espaços ou caracteres especiais.

### Cenário — Cor inválida

- **Dado** que o usuário esteja na tela **Cadastrar Produto**
- **E** os demais campos obrigatórios estejam preenchidos com dados válidos
- **Quando** informar uma cor que não atenda às condições da RN-002
- **E** clicar em **Cadastrar produto**
- **Então** o sistema deve impedir a conclusão do cadastro
- **E** deve exibir a mensagem `Informe uma cor válida para a variação.`
- **E** a variação não deve ser persistida

---

## CA-003 — Deve bloquear o cadastro quando o tamanho da variação não atender à RN-003

**Regra relacionada:** RN-003 — Tamanho da variação deve ser obrigatório e válido

### Condições de aceite

Após remover espaços no início e no fim, o tamanho deve:

- possuir valor informado;
- aceitar tamanhos alfabéticos, numéricos ou descritivos utilizados comercialmente;
- aceitar letras, números, espaços e os caracteres `-` e `/`;
- representar um único valor;
- não ser formado apenas por espaços ou caracteres especiais;
- quando exclusivamente numérico, possuir no máximo 2 dígitos.

### Cenário — Tamanho inválido

- **Dado** que o usuário esteja na tela **Cadastrar Produto**
- **E** os demais campos obrigatórios estejam preenchidos com dados válidos
- **Quando** informar um tamanho que não atenda às condições da RN-003
- **E** clicar em **Cadastrar produto**
- **Então** o sistema deve impedir a conclusão do cadastro
- **E** deve exibir a mensagem `Informe um tamanho válido para a variação.`
- **E** a variação não deve ser persistida

---

## CA-004 — Deve bloquear o cadastro quando o SKU da variação não atender à RN-004

**Regra relacionada:** RN-004 — SKU da variação deve ser obrigatório e válido

### Condições de aceite

Antes da validação, o sistema deve remover espaços no início e no fim e padronizar o SKU para letras maiúsculas.

O SKU deve:

- possuir no mínimo três blocos;
- utilizar `-` como separador;
- possuir conteúdo em todos os blocos;
- aceitar apenas letras e números dentro dos blocos;
- não conter espaços internos;
- não utilizar outros caracteres como separadores;
- não iniciar com hífen;
- não terminar com hífen;
- não possuir hífens consecutivos.

Estrutura mínima esperada:

`<PREFIXO>-<COR>-<TAMANHO>`

### Cenário — SKU estruturalmente inválido

- **Dado** que o usuário esteja na tela **Cadastrar Produto**
- **E** os demais campos obrigatórios estejam preenchidos com dados válidos
- **Quando** informar um SKU que não atenda à estrutura definida na RN-004
- **E** solicitar o cadastro
- **Então** o sistema deve impedir a conclusão do cadastro
- **E** deve exibir a mensagem `Informe um SKU válido para a variação.`
- **E** a variação não deve ser persistida
- **E**, quando a validação ocorrer pela API, a resposta deve ser `400 Bad Request`

---

## CA-005 — Deve bloquear o cadastro quando o SKU já estiver cadastrado

**Regra relacionada:** RN-005 — SKU da variação deve ser único

### Cenário — SKU equivalente já existente

- **Dado** que exista uma variação cadastrada com determinado SKU
- **E** o usuário esteja na tela **Cadastrar Produto**
- **E** os demais campos obrigatórios estejam preenchidos com dados válidos
- **Quando** informar um SKU equivalente ao já cadastrado, considerando remoção de espaços externos e padronização para maiúsculas
- **E** clicar em **Cadastrar produto**
- **Então** o sistema deve identificar a duplicidade
- **E** deve impedir a conclusão do cadastro
- **E** deve exibir a mensagem `SKU já cadastrado para outra variação.`
- **E** nenhuma nova variação deve ser persistida com o mesmo SKU normalizado

---

## CA-006 — Deve bloquear o cadastro quando o preço da variação não atender à RN-006

**Regra relacionada:** RN-006 — Preço da variação deve ser obrigatório e válido

### Condições de aceite

O preço deve:

- ser obrigatório;
- representar valor em Real Brasileiro;
- aceitar até duas casas decimais;
- ser maior que `0`;
- ser persistido como valor numérico;
- ser exibido ao usuário no formato monetário brasileiro.

### Cenário — Preço inválido

- **Dado** que o usuário esteja na tela **Cadastrar Produto**
- **E** os demais campos obrigatórios estejam preenchidos com dados válidos
- **Quando** informar um preço que não atenda às condições da RN-006
- **E** clicar em **Cadastrar produto**
- **Então** o sistema deve impedir a conclusão do cadastro
- **E** deve exibir a mensagem `Informe um preço válido para a variação.`
- **E** a variação não deve ser persistida

---

## CA-007 — Deve tratar corretamente a quantidade inicial da variação

**Regra relacionada:** RN-007 — Quantidade inicial da variação deve ser opcional

### Cenário 1 — Quantidade inicial não informada

- **Dado** que o usuário esteja na tela **Cadastrar Produto**
- **E** os demais campos obrigatórios estejam preenchidos com dados válidos
- **Quando** deixar o campo **Quantidade inicial** vazio
- **E** clicar em **Cadastrar produto**
- **Então** o sistema deve concluir o cadastro com sucesso
- **E** deve persistir a quantidade inicial com valor `0`
- **E** deve exibir a mensagem `Produto cadastrado com sucesso.`

### Cenário 2 — Quantidade inicial válida

- **Dado** que o usuário esteja na tela **Cadastrar Produto**
- **Quando** informar um número inteiro maior ou igual a `0` em **Quantidade inicial**
- **Então** o sistema deve aceitar o valor informado

### Cenário 3 — Quantidade inicial inválida

- **Dado** que o usuário esteja na tela **Cadastrar Produto**
- **Quando** informar valor negativo ou decimal em **Quantidade inicial**
- **Então** o sistema deve impedir a conclusão do cadastro
- **E** o valor inválido não deve ser persistido

---

## CA-008 — Deve bloquear o cadastro de variação duplicada para o mesmo produto

**Regra relacionada:** RN-008 — Duplicidade de cadastro da variação por produto, cor e tamanho

### Cenário — Produto, cor e tamanho equivalentes

- **Dado** que exista uma variação cadastrada para determinado produto
- **E** o usuário esteja na tela **Cadastrar Produto**
- **E** os demais campos obrigatórios estejam preenchidos com dados válidos
- **Quando** informar uma combinação equivalente de produto, cor e tamanho já existente
- **E** utilizar um SKU diferente do SKU da variação já cadastrada
- **E** clicar em **Cadastrar produto**
- **Então** o sistema deve identificar a duplicidade após a normalização de cor e tamanho
- **E** deve impedir a conclusão do cadastro
- **E** deve exibir a mensagem `Já existe uma variação cadastrada para este produto com a mesma cor e tamanho.`
- **E** nenhuma nova variação duplicada deve ser persistida

---

## CA-009 — Deve bloquear o cadastro quando o estoque mínimo não atender à RN-009

**Regra relacionada:** RN-009 — Estoque mínimo da variação deve ser obrigatório

### Condições de aceite

O estoque mínimo deve:

- ser obrigatório;
- aceitar somente números inteiros;
- possuir valor maior ou igual a `10`;
- rejeitar valores negativos;
- rejeitar valores decimais.

### Cenário — Estoque mínimo inválido

- **Dado** que o usuário esteja na tela **Cadastrar Produto**
- **E** os demais campos obrigatórios estejam preenchidos com dados válidos
- **Quando** informar um valor de estoque mínimo que não atenda às condições da RN-009
- **E** clicar em **Cadastrar produto**
- **Então** o sistema deve impedir a conclusão do cadastro
- **E** deve exibir a mensagem `O estoque mínimo deve ser um número inteiro maior ou igual a 10.`
- **E** a variação não deve ser persistida

---

## CA-010 — Deve permitir o cadastro de produto com variação válida

**Regra relacionada:** RN-010 — Cadastro de produto com variação válida

### Cenário — Cadastro válido

- **Dado** que o usuário esteja na tela **Cadastrar Produto**
- **E** os dados informados atendam às regras aplicáveis ao produto e à variação
- **Quando** clicar em **Cadastrar produto**
- **Então** o sistema deve concluir o cadastro com sucesso
- **E** deve exibir a mensagem `Produto cadastrado com sucesso.`
- **E** os dados do produto e da variação devem ser persistidos
- **E** a variação deve ficar vinculada ao produto correspondente
- **E** o produto cadastrado deve ficar disponível para consulta no módulo de estoque

---

## CA-011 — Deve permitir a alteração do estoque mínimo da variação

**Regra relacionada:** RN-011 — Alteração do estoque mínimo na edição da variação

### Cenário — Alterar somente o estoque mínimo com valor válido

- **Dado** que exista uma variação cadastrada
- **E** que sua quantidade atual em estoque esteja registrada
- **E** o usuário esteja na tela de edição da variação
- **Quando** alterar somente o campo **Estoque mínimo**
- **E** informar um número inteiro maior ou igual a `10`
- **E** clicar em **Salvar alterações**
- **Então** o sistema deve concluir a atualização com sucesso
- **E** deve exibir a mensagem `Alteração salva com sucesso`
- **E** o novo estoque mínimo deve ser persistido para a variação correspondente
- **E** a quantidade atual em estoque deve permanecer com o mesmo valor existente antes da edição

> **Observação de cobertura:** o CT-EST-EDT-001 atualmente valida a alteração e persistência do estoque mínimo. A condição de preservação da quantidade atual deve ser validada explicitamente para que o CA-011 seja considerado integralmente coberto.

---

## CA-012 — Deve manter novas variações vinculadas ao produto existente

**Regra relacionada:** RN-012 — Vínculo produto/variações

### Cenário — Adicionar nova variação a produto já identificado como existente

- **Dado** que o sistema tenha identificado um produto já existente
- **E** esse produto possua uma variação cadastrada
- **Quando** uma nova variação válida for cadastrada para esse mesmo produto
- **Então** o sistema deve reutilizar o registro do produto existente
- **E** não deve criar um novo registro na entidade `produto`
- **E** deve vincular a nova variação ao mesmo `id_produto`
- **E** cada variação deve possuir seu próprio `id_variacao`
- **E** cada variação deve possuir SKU próprio e único

### Resultado esperado no relacionamento

```text
produto
id_produto = X
      │
      ├── variação A
      │   id_variacao = A
      │
      └── variação B
          id_variacao = B
```

> **Ponto de especificação:** a RN-012 define o comportamento após o produto ser reconhecido como existente, mas não formaliza qual chave de negócio determina essa identificação. Essa decisão deve ser explicitada pelo produto/PO caso a regra precise evoluir.
