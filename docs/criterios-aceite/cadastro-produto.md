## CA-01 — Bloquear cadastro com nome abaixo do limite mínimo

Dado que o usuário está na tela **Cadastrar Produto**
E preenche os demais campos obrigatórios com dados válidos
Quando informar um nome de produto com menos de 3 caracteres
E clicar em **Cadastrar produto**
Então o sistema deve impedir a conclusão do cadastro
E deve exibir a mensagem `Informe um nome de produto válido.`
E o produto não deve ser cadastrado.