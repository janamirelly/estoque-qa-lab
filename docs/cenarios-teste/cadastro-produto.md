CT-001 - Acessar tela de cadastro pelo menu
CT-002 - Bloquear cadastro com nome vazio
CT-003 - Bloquear cadastro com nome apenas numérico
CT-004 - Bloquear cadastro sem SKU
CT-005 - Cadastrar produto com variação válida
CT-006 - Bloquear SKU duplicado

## CT-002 - Bloquear cadastro com nome vazio

### Regra relacionada
RN-002

### Critério de aceite relacionado
CA-002

### Massa de teste

| Campo | Valor |
|---|---|
| Nome do produto | vazio |
| Cor | Preta |
| Tamanho | G |
| SKU | CAM-PRETO-G |
| Preço | 59.90 |

### Passos
1. Acessar a aplicação.
2. Clicar em "Cadastrar Produto".
3. Deixar o campo Nome do produto vazio.
4. Preencher os demais campos obrigatórios.
5. Clicar em "Cadastrar produto".

### Resultado esperado
- O cadastro deve ser bloqueado.
- A mensagem "Informe um nome de produto válido." deve ser exibida.