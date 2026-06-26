# BANK-JS 💰



![Status](https://img.shields.io/badge/status-em%20desenvolvimento-green)




![Node.js](https://img.shields.io/badge/Node.js-green?logo=node.js&logoColor=white)




![Express](https://img.shields.io/badge/Express-green?logo=express&logoColor=white)




![PostgreSQL](https://img.shields.io/badge/PostgreSQL-green?logo=postgresql&logoColor=white)




![JavaScript](https://img.shields.io/badge/JavaScript-green?logo=javascript&logoColor=white)




![JWT](https://img.shields.io/badge/JWT-green?logo=jsonwebtokens&logoColor=white)




![License](https://img.shields.io/badge/licença-MIT-green)



API REST bancária construída em Node.js + Express, desenvolvida como projeto de portfólio para aplicação de conceitos de back-end.

## Sobre o projeto

O BankJS começou como um sistema de terminal e evoluiu para uma API REST completa com autenticação JWT, criptografia de senhas e banco de dados relacional. O projeto segue um roadmap de fases com foco em boas práticas: estrutura modular, segurança, SQL puro e deploy em nuvem.

## Status

🚧 Fase 7 em andamento — Deploy no Railway

## Roadmap

- ✅ Fase 1 — Sistema de terminal
- ✅ Fase 2 — API REST com Express
- ✅ Fase 3 — Refatoração em módulos
- ✅ Fase 4 — Área de gestão
- ✅ Fase 5 — Autenticação JWT + bcrypt
- ✅ Fase 6 — Migração para PostgreSQL
- ⏳ Fase 7 — Deploy no Railway
- ⏳ Fase 8 — Frontend React (Vite + Tailwind + Recharts)

## Funcionalidades

**Usuário**
- Cadastro com validação de CPF duplicado e hash bcrypt na senha
- Login com JWT (1h) e bloqueio automático após 3 tentativas erradas
- Depósito, saque e transferência com validações
- Extrato de transações com data e hora
- Consulta de saldo
- Rotas protegidas por JWT

**Gestão**
- Cadastro de gestores com validação de email corporativo (@bankjs.com.br) e senha mínimo 8 caracteres
- Autenticação com JWT (1h)
- Listagem de todas as contas
- Busca de conta por CPF
- Bloqueio/desbloqueio de usuários
- Visualização de todas as transações

**Segurança**
- Senhas armazenadas com hash bcrypt
- Autenticação via JWT em todas as rotas protegidas
- Bloqueio automático após 3 tentativas de senha incorretas
- Queries parametrizadas para prevenção de SQL injection
- Credenciais no `.env` — nunca expostas no código

## Banco de dados

PostgreSQL com SQL puro (sem ORM) via biblioteca `pg`.

**Tabelas:**
- `users` — dados do usuário, saldo, tentativas e status de bloqueio
- `extratouser` — transações vinculadas ao usuário via chave estrangeira
- `managers` — gestores com autenticação separada

## Stack

- Node.js + Express 5
- PostgreSQL + `pg`
- JWT (`jsonwebtoken`)
- bcrypt
- dotenvx

## Como rodar

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Preencha DB_PASSWORD e JWT_SECRET

# Rodar o servidor
node server/server.js