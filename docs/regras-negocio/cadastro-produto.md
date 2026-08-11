## RN01 — Nome do produto deve ser obrigatório e válido

Antes da validação, o sistema deve remover espaços em branco no início e no fim do nome informado.

O campo Nome do produto deve:
- ser obrigatório;
- conter entre 3 e 30 caracteres;
- conter pelo menos uma letra;
- aceitar letras, números, espaços, acentos e os caracteres - / . ( ) %;
- rejeitar valores formados apenas por números, espaços ou caracteres especiais.
- bloquear o cadastro e apresentar a mensagem definida quando inválido.



## RN11 - Alteração do estoque mínimo da variação
O usuário responsável pela gestão de estoque deve poder alterar o estoque mínimo de uma variação existente.

O estoque mínimo deve:
- ser informado com número inteiro;
- possuir valor maior ou igual a 10.
- ser atualizado quando a alteração for salva com um valor válido.

A quantidade atual em estoque não deve ser alterada por meio da edição do cadastro do produto, pois alterações de quantidade devem ocorrer por movimentações de estoque.

