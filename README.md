# BANK-JS 💰



![Status](https://img.shields.io/badge/status-em%20desenvolvimento-green)




![Node.js](https://img.shields.io/badge/Node.js-green?logo=node.js&logoColor=white)




![Express](https://img.shields.io/badge/Express-green?logo=express&logoColor=white)




![JavaScript](https://img.shields.io/badge/JavaScript-green?logo=javascript&logoColor=white)




![License](https://img.shields.io/badge/licença-MIT-green)



API REST bancária construída em Node.js + Express, desenvolvida como projeto de portfólio para aplicação de conceitos de back-end.

## Sobre o projeto

O bank.js começou como um sistema de terminal e evoluiu para uma API REST modular. O projeto segue um roadmap de sprints com foco em boas práticas: estrutura MVC, autenticação JWT, banco de dados relacional e deploy em nuvem.

## Status

🚧 Sprint 5 em andamento — Área de gestão (autenticação de gestor, cadastro administrativo)

## Funcionalidades

**Usuário**
- Cadastro com validação de CPF duplicado e tipo de conta
- Autenticação por CPF e senha
- Depósito, saque e transferência com validações
- Extrato de transações com data e hora

**Gestão**
- Cadastro e autenticação de gestores
- Área administrativa separada da área de usuário

**Segurança**
- Detector de fraude automático
- Bloqueio de cartão por atividade suspeita
- Saques acima de R$1.000 geram ponto de fraude
- 3 saques consecutivos geram ponto de fraude
- 2 pontos de fraude bloqueiam o cartão automaticamente

## Como rodar

```bash
npm install
node server/server.js