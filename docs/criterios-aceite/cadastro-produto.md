CA-002 - Bloqueio de cadastro com nome vazio

Dado que o usuário está na tela de cadastro do produto
Quando não preencher o campo Nome do produto 
E preencher os demais campos obrigatórios
E clicar no botão Cadastrar produto
Então o sistema deve impedir a conclusão do cadastro
E deve exibir a mensagem "Informe um nome de produto válido."