# BankJS 💰
 
Sistema bancário no terminal feito em JavaScript puro (Node.js).
 
## Funcionalidades
 
- Cadastro de usuários com validação de CPF duplicado e tipo de conta
- Login com autenticação por nome e senha
- Saque com validação de saldo e valor
- Depósito com validação de valor
- Transferência entre contas via CPF
- Extrato de transações individual
- Detector de fraude automático
- Bloqueio de cartão por atividade suspeita
- Logout e troca de usuário
## Como rodar
 
```bash
node bank.js
```
 
## Regras de negócio
 
- Tipo de conta: Corrente ou Poupança
- CPF único por cadastro — não permite duplicados
- Nome de usuário aceita somente letras
- Transferências identificadas pelo CPF do recebedor
## Regras de segurança
 
- Saques acima de R$1.000 geram ponto de suspeita
- 3 saques seguidos geram ponto de suspeita
- 2 pontos de suspeita bloqueiam o cartão automaticamente
- Cartão bloqueado impede login até contato com a central
## Tecnologias
 
- Node.js
- JavaScript ES Modules
- readline/promises
