# BankJS 💰
 
Sistema bancário construído em JavaScript puro (Node.js) — do terminal até uma API REST funcional.
 
## Sobre o projeto
 
O BankJS começou como um sistema de terminal e evoluiu para uma API REST completa. O objetivo final é se tornar um sistema bancário web com frontend, banco de dados e autenticação JWT.
 
## Funcionalidades
 
- Cadastro de usuários com validação de CPF duplicado e tipo de conta
- Login com autenticação por nome e senha
- Saque com validação de saldo e valor
- Depósito com validação de valor
- Transferência entre contas via CPF
- Extrato de transações com data e hora
- Detector de fraude automático
- Bloqueio de cartão por atividade suspeita
- Persistência de dados em arquivo JSON
## Como rodar
 
### Terminal
```bash
node bank.js
```
 
### API REST
```bash
node server.js
```
Servidor disponível em `http://localhost:3000`
 
## Rotas da API
 
| Método | Rota | Descrição |
|---|---|---|
| POST | /cadastrar | Cria uma nova conta |
| POST | /login | Autentica o usuário |
| POST | /depositar | Realiza um depósito |
| POST | /sacar | Realiza um saque |
| POST | /transferir | Transfere entre contas |
| GET | /saldo | Consulta o saldo |
| GET | /extrato | Busca o extrato completo |
 
## Exemplos de requisição
 
**POST /cadastrar**
```json
{
  "tipo": "Corrente",
  "cpf": "12345678900",
  "nome": "João",
  "senha": "1234"
}
```
 
**POST /depositar**
```json
{
  "cpf": "12345678900",
  "valorDepositar": 500
}
```
 
**POST /transferir**
```json
{
  "cpf": "12345678900",
  "cpfDestino": "98765432100",
  "valorTransferencia": 200
}
```
 
## Regras de negócio
 
- Tipo de conta: Corrente ou Poupança
- CPF único por cadastro
- Nome de usuário aceita somente letras
- Transferências identificadas pelo CPF do recebedor
## Regras de segurança
 
- Saques acima de R$1.000 geram ponto de fraude
- 3 saques consecutivos geram ponto de fraude
- 2 pontos de fraude bloqueiam o cartão automaticamente
- Cartão bloqueado impede login
## Tecnologias
 
- Node.js
- JavaScript ES Modules
- Express.js
- readline/promises
- fs (File System)
