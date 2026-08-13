# Especificação de Negócio — Cadastro de Produto

## Contexto
A funcionalidade de Cadastro de Produto permite registrar produtos e suas variações para controle de estoque, 
consulta operacional e movimentações de estoque.

## Objetivo
Permitir o cadastro de produtos e suas variações com dados válidos, 
garantindo identificação, unicidade, consistência dos dados e disponibilidade para consulta no estoque.

## Usuário principal 
- **Estoquista:** responsável pelo cadastro e manutenção das informações operacionais de produtos e variações no módulo de estoque.


## Regras de negócio

## RN-001 — Nome do produto deve ser obrigatório e válido

Antes da validação, o sistema deve remover espaços em branco no início e no fim do nome informado.

O campo Nome do produto deve:
- ser obrigatório;
- conter entre 3 e 30 caracteres;
- conter pelo menos uma letra;
- aceitar letras, números, espaços, acentos e os caracteres - / . ( ) %;
- rejeitar valores formados apenas por números, espaços ou caracteres especiais.
- bloquear o cadastro e apresentar a mensagem definida quando inválido.

## RN-002 — Cor da variação deve ser obrigatória e válida

Antes da validação, o sistema deve remover espaços em branco no início e no fim da cor informada.

O campo Cor da variação deve:
- ser obrigatório;
- conter no mínimo 3 caracteres;
- conter letras, espaços, acentos e os caracteres especiais: - /;
- não aceitar valores formados apenas por números, espaços ou caracteres especiais.

Quando a cor for inválida, o sistema deve impedir o cadastro e exibir a mensagem:
"Informe uma cor válida para a variação."

 
## RN-003 — Tamanho da variação deve ser obrigatório e válido

Antes da validação, o sistema deve remover espaços em branco no início e no fim do tamanho informado.

O campo Tamanho da variação deve:

- ser obrigatório;
- aceitar tamanhos alfabéticos, numéricos ou descritivos utilizados comercialmente;
- conter letras, números, espaços e os caracteres especiais `-` e `/`;
- aceitar valor único;
- não aceitar valores formados apenas por espaços ou caracteres especiais;
- quando exclusivamente numérico, conter no máximo 2 dígitos.

Quando o tamanho for inválido, o sistema deve impedir o cadastro e exibir a mensagem:
`Informe um tamanho válido para a variação.`


## RN-004 — SKU da variação deve ser obrigatório e válido

Antes da validação, o sistema deve remover espaços em branco no início e no fim do SKU informado e converter o valor para letras maiúsculas.

O campo SKU da variação deve:

* ser obrigatório;
* possuir no mínimo três blocos;
* utilizar o hífen (`-`) como separador entre os blocos;
* possuir conteúdo em todos os blocos;
* aceitar apenas letras e números dentro de cada bloco;
* não conter espaços;
* não utilizar outros caracteres como separadores;
* não iniciar ou terminar com hífen;
* não possuir hífens consecutivos.

A estrutura mínima esperada é:

`<PREFIXO>-<COR>-<TAMANHO>`

A parte correspondente à cor pode possuir mais de um bloco quando necessário.

Exemplos válidos:

* `CAM-AZUL-M`
* `CAM-PRETA-G`
* `CAL-JEANS-40`
* `CAM-AZUL-MARINHO-G`
* `BLU-PRETA-P`

Exemplos inválidos:

* `CAMAZULM`
* `CAM_AZUL_M`
* `CAM AZUL M`
* `CAM-AZUL`
* `CAM--M`
* `-CAM-AZUL-M`
* `CAM-AZUL-M-`

Quando o SKU informado não atender à estrutura definida, o sistema deve impedir o cadastro e retornar:

`400 Bad Request`

com a mensagem:

`Informe um SKU válido para a variação.`


## RN-005 — SKU da variação deve ser único

- O sistema não deve permitir o cadastro de duas variações com o mesmo **SKU**.
- Antes da comparação, o sistema deve remover espaços no início e no fim do **SKU**.
- A comparação do SKU deve considerar o valor após remoção de espaços no início/fim e padronização para letras maiúsculas.

Quando identificar um SKU já cadastrado, o sistema deve impedir o cadastro e exibir a mensagem: SKU já cadastrado para outra variação.


##RN-006 - Preço da variação deve ser obrigatório e válido

Antes da validação, o sistema deve remover espaços em branco no início e no fim do preço informado.

O campo preço da variação deve:
- ser obrigatório
- ser informado em Real Brasileiro (BRL/R$).
- aceitar valores monetários com até duas casas decimais.
- ser maior que R$ 0,00.
- ser armazenado como valor numérico e exibido ao usuário no formato de moeda brasileira: R$ 0,00.

Quando o preço for inválido, o sistema deve impedir o cadastro e  exibir a mensagem: Informe um preço válido para a variação.

## RN-007 — Quantidade inicial da variação deve ser opcional

O campo Quantidade inicial deve:

- permitir o cadastro da variação sem valor informado;
- quando não informado, ser registrado com valor padrão `0`;
- aceitar apenas números inteiros;
- não aceitar valores negativos;
- não aceitar valores decimais;
- representar o estoque atual da variação no momento do cadastro.

## RN-008 — Duplicidade de cadastro da variação por produto, cor e tamanho

- O sistema deve impedir o cadastro de uma variação duplicada para o mesmo produto.
- Uma variação será considerada duplicada quando já existir, para o mesmo produto, uma combinação equivalente de Cor e Tamanho.
- A verificação deve considerar o produto ao qual a variação está vinculada, conforme a RN-012.
- Antes da comparação, o sistema deve normalizar os campos Cor e Tamanho, removendo espaços no início e no fim, convertendo para letras maiúsculas e desconsiderando acentuação.
- A validação de duplicidade por Cor e Tamanho deve ocorrer mesmo quando o SKU informado for diferente.

Quando a duplicidade for identificada, o sistema deve bloquear o cadastro e exibir a mensagem:
`Já existe uma variação cadastrada para este produto com a mesma cor e tamanho.`

## RN-009 — Estoque mínimo da variação deve ser obrigatório

O campo Estoque mínimo deve:

- ser obrigatório;
- aceitar apenas números inteiros;
- aceitar valores maiores ou iguais a 10;
- não aceitar valores negativos;
- não aceitar valores decimais;
- representar a quantidade mínima desejada em estoque para a variação.

Quando o Estoque mínimo for inválido, o sistema deve impedir o cadastro e exibir a mensagem:
`O estoque mínimo deve ser um número inteiro maior ou igual a 10.`

## RN-010 — Cadastro de produto com variação válida

O sistema deve permitir o cadastro quando os dados do produto e da variação estiverem preenchidos e válidos.

Para concluir o cadastro:

- o Nome do produto deve ser válido;
- a Cor da variação deve ser válida;
- o Tamanho da variação deve ser válido;
- o SKU da variação deve ser válido e único;
- o Preço da variação deve ser válido;
- a Quantidade inicial, quando não informada, deve ser registrada com valor padrão `0`;
- a combinação de Produto, Cor e Tamanho não deve existir previamente.

Ao finalizar o cadastro, a variação deve ser vinculada ao produto correspondente, respeitando a RN-012.

Quando o produto já existir, o sistema deve adicionar a nova variação ao produto existente, sem criar um novo registro de produto.

Após o cadastro, o produto e sua variação devem ficar disponíveis para consulta no módulo de estoque.

Quando o cadastro for concluído com sucesso, o sistema deve exibir a mensagem:
`Produto cadastrado com sucesso.`

## RN-011 - Alteração do estoque mínimo da variação
O usuário responsável pela gestão de estoque deve poder alterar o estoque mínimo de uma variação existente.

O estoque mínimo deve:
- ser informado com número inteiro;
- possuir valor maior ou igual a 10.
- ser atualizado quando a alteração for salva com um valor válido.

A quantidade atual em estoque não deve ser alterada por meio da edição do cadastro do produto, 
pois alterações de quantidade devem ocorrer por movimentações de estoque.

## RN-012 — Variações do mesmo produto devem permanecer vinculadas ao produto de origem

Um produto pode possuir uma ou mais variações.

Quando uma nova variação for cadastrada para um produto já existente, o sistema deve reutilizar o registro do produto existente 
e vincular a nova variação ao mesmo identificador do produto.

O sistema não deve criar um novo registro de produto para cada variação cadastrada.

Cada variação deve:

- possuir seu próprio identificador;
- possuir SKU único;
- estar vinculada a um único produto;
- compartilhar o mesmo identificador de produto com as demais variações pertencentes ao mesmo produto.

Exemplo:

Produto: Calça Jeans

- CAL-PRETA-P
- CAL-PRETA-M
- CAL-PRETA-G

As três variações devem estar associadas ao mesmo produto, diferenciando-se por seus próprios registros de variação.




