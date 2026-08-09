## CA-01 — Bloquear cadastro com nome abaixo do limite mínimo

Dado que o usuário está na tela **Cadastrar Produto**
E preenche os demais campos obrigatórios com dados válidos
Quando informar um nome de produto com menos de 3 caracteres
E clicar em **Cadastrar produto**
Então o sistema deve impedir a conclusão do cadastro
E deve exibir a mensagem `Informe um nome de produto válido.`
E o produto não deve ser cadastrado.

## CA-02 — Permitir Cadastro com Dados Válidos

Dado: que o usuário está na tela **Cadastrar Produto**
Quando preencher todos os campos obrigatórios com dados válidos
E clicar em **Cadastrar produto**
Então o sistema deve concluir o cadastro com sucesso
E deve exibir a mensagem `Produto cadastrado com sucesso`
E o produto deve ser cadastrado