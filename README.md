# BankJS 💰

Sistema bancário no terminal feito em JavaScript puro (Node.js).

## Funcionalidades
- Cadastro de usuários
- Login com autenticação por nome e senha
- Saque e depósito por usuário
- Extrato de transações individual
- Detector de fraude automático
- Bloqueio de cartão por atividade suspeita
- Logout e troca de usuário

## Como rodar
```bash
node bank.js
```

## Regras de segurança
- Saques acima de R$1000 geram ponto de suspeita
- 3 saques seguidos geram ponto de suspeita
- 2 pontos de suspeita bloqueiam o cartão automaticamente
- Cartão bloqueado impede login até contato com a central

## Tecnologias
- Node.js
- JavaScript ES Modules
- readline/promises
