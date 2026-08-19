# Critérios de Aceite — Cadastro de Produto

## CA-001 — Deve bloquear o cadastro quando o nome do produto for inválido

**Regra relacionada:** RN-001 — Nome do produto deve ser obrigatório e válido

Dado que o usuário está na tela **Cadastrar Produto**
Quando informar um valor inválido no campo **Nome do produto**
E preenche os demais campos obrigatórios com dados válidos
E clicar em **Cadastrar produto**
Então o sistema deve impedir a conclusão do cadastro
E deve exibir a mensagem `Informe um nome de produto válido.`
E o produto não deve ser cadastrado.

---

## CA-002 — Deve bloquear o cadastro quando a cor da variação for inválida

**Regra relacionada:** RN-002 — Cor da variação deve ser obrigatória e válida

Dado que o usuário está na tela **Cadastrar Produto**
Quando informar um valor inválido no campo **Cor da variação**
E preenche os demais campos obrigatórios com dados válidos
E clicar em **Cadastrar produto**
Então o sistema deve impedir a conclusão do cadastro
E deve exibir a mensagem `Informe uma cor válida para a variação.`
E a variação não deve ser cadastrada.

---

## CA-003 — Deve bloquear o cadastro quando o tamanho da variação for inválido

**Regra relacionada:** RN-003 — Tamanho da variação deve ser obrigatório e válido

Dado que o usuário está na tela **Cadastrar Produto**
E preenche os demais campos obrigatórios com dados válidos
Quando informar um valor inválido no campo **Tamanho da variação**
E clicar em **Cadastrar produto**
Então o sistema deve impedir a conclusão do cadastro
E deve exibir a mensagem `Informe um tamanho válido para a variação.`
E a variação não deve ser cadastrada.

---

## CA-004 — Deve bloquear o cadastro quando o SKU da variação for inválido

**Regra relacionada:** RN-004 — SKU da variação deve ser obrigatório e válido

Dado que o usuário está na tela **Cadastrar Produto**
E preenche os demais campos obrigatórios com dados válidos
Quando informar um valor inválido no campo **SKU da variação**
E clicar em **Cadastrar produto**
Então o sistema deve impedir a conclusão do cadastro
E deve exibir a mensagem `Informe um SKU válido para a variação.`
E a variação não deve ser cadastrada.

---

## CA-005 — Deve bloquear o cadastro com SKU já cadastrado

**Regra relacionada:** RN-005 — SKU da variação deve ser único

Dado que existe uma variação cadastrada com determinado SKU
E o usuário está na tela **Cadastrar Produto**
E preenche os demais campos obrigatórios com dados válidos
Quando informar um SKU equivalente ao já cadastrado
E clicar em **Cadastrar produto**
Então o sistema deve remover os espaços no início e no fim do SKU informado
E deve converter o valor para letras maiúsculas
E deve identificar que o SKU já está cadastrado
E deve impedir a conclusão do cadastro
E deve exibir a mensagem `SKU já cadastrado para outra variação.`
E uma nova variação não deve ser persistida com o mesmo SKU.

---

## CA-006 — Deve bloquear o cadastro quando o preço da variação for inválido

**Regra relacionada:** RN-006 — Preço da variação deve ser obrigatório e válido

Dado que o usuário está na tela **Cadastrar Produto**
E preenche os demais campos obrigatórios com dados válidos
Quando informar um valor inválido no campo **Preço da variação**
E clicar em **Cadastrar produto**
Então o sistema deve impedir a conclusão do cadastro
E deve exibir a mensagem `Informe um preço válido para a variação.`
E a variação não deve ser cadastrada.

---

## CA-007 — Deve tratar corretamente a quantidade inicial da variação

**Regra relacionada:** RN-007 — Quantidade inicial da variação deve ser opcional

Dado que o usuário está na tela **Cadastrar Produto**
E preenche os demais campos obrigatórios com dados válidos
Quando deixar o campo **Quantidade inicial** sem preencher
E clicar em **Cadastrar produto**
Então o sistema deve concluir o cadastro com sucesso
E deve registrar a quantidade inicial com valor padrão `0`
E deve exibir a mensagem `Produto cadastrado com sucesso.`

Quando um valor for informado no campo **Quantidade inicial**
Então o sistema deve aceitar somente números inteiros maiores ou iguais a `0`
E deve impedir o cadastro quando o valor informado for negativo ou decimal.

---

## CA-008 — Deve bloquear o cadastro de variação duplicada

**Regra relacionada:** RN-008 — Duplicidade de cadastro da variação por produto, cor e tamanho

Dado que existe uma variação cadastrada para determinado produto
E o usuário está na tela **Cadastrar Produto**
E preenche os demais campos obrigatórios com dados válidos
Quando informar uma combinação equivalente de produto, cor e tamanho já existente
E clicar em **Cadastrar produto**
Então o sistema deve identificar a duplicidade após a normalização dos valores
E deve impedir a conclusão do cadastro
E deve exibir a mensagem `Já existe uma variação cadastrada para este produto com a mesma cor e tamanho.`
E uma nova variação não deve ser persistida.

---

## CA-009 — Deve bloquear o cadastro quando o estoque mínimo for inválido

**Regra relacionada:** RN-009 — Estoque mínimo da variação deve ser obrigatório

Dado que o usuário está na tela **Cadastrar Produto**
E preenche os demais campos obrigatórios com dados válidos
Quando informar um valor inválido no campo **Estoque mínimo**
E clicar em **Cadastrar produto**
Então o sistema deve impedir a conclusão do cadastro
E deve exibir a mensagem `O estoque mínimo deve ser um número inteiro maior ou igual a 10.`
E a variação não deve ser cadastrada.

---

## CA-010 — Deve permitir o cadastro de produto com variação válida

**Regra relacionada:** RN-010 — Cadastro de produto com variação válida

Dado que o usuário está na tela **Cadastrar Produto**
Quando preencher os dados do produto e da variação com valores válidos
E clicar em **Cadastrar produto**
Então o sistema deve concluir o cadastro com sucesso
E deve exibir a mensagem `Produto cadastrado com sucesso.`
E os dados do produto e da variação devem ser persistidos
E o produto cadastrado deve ficar disponível para consulta no módulo de estoque.

---

## CA-011 — Deve permitir a alteração do estoque mínimo da variação

**Regra relacionada:** RN-011 — Alteração do estoque mínimo da variação

Dado que existe uma variação cadastrada
E o usuário está na tela **Consultar estoque**
Quando acessar a edição da variação
E informar um valor válido no campo **Estoque mínimo**
E clicar em **Salvar alterações**
Então o sistema deve concluir a atualização com sucesso
E deve exibir a mensagem `Alteração salva com sucesso`
E o novo valor de estoque mínimo deve ser persistido
E a quantidade atual em estoque não deve ser alterada.

---

## CA-012 — Deve manter as variações vinculadas ao mesmo produto

**Regra relacionada:** ** RN-012 — Vínculo produto/variações

Dado que existe um produto cadastrado com uma variação
Quando uma nova variação válida for cadastrada para o mesmo produto
Então o sistema deve reutilizar o registro do produto existente
E não deve criar um novo registro de produto
E deve vincular a nova variação ao mesmo produto
E cada variação deve possuir seu próprio identificador
E as variações pertencentes ao mesmo produto devem compartilhar o mesmo `id_produto`.
