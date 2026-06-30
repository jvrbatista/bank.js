# BankJS 💰



![Status](https://img.shields.io/badge/status-fase%201%20completa-brightgreen)




![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)




![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)




![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)




![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)




![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)




![Railway](https://img.shields.io/badge/Railway-0B0D0E?logo=railway&logoColor=white)




![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)




![License](https://img.shields.io/badge/licença-MIT-blue)



API REST bancária full stack construída com Node.js + Express e React, desenvolvida como projeto de portfólio para aplicação de conceitos de back-end, segurança e deploy em nuvem.

## 🔗 Deploy

- **Frontend:** [bankjs-app-production.up.railway.app](https://bankjs-app-production.up.railway.app)
- **Backend:** [bankjs-production.up.railway.app](https://bankjs-production.up.railway.app)

## 📖 Sobre o projeto

O BankJS começou como um sistema de terminal e evoluiu para uma aplicação full stack completa. O backend foi construído com foco em boas práticas de segurança: autenticação JWT, criptografia de senhas com bcrypt, queries parametrizadas para prevenção de SQL injection e banco de dados relacional com PostgreSQL usando SQL puro.

## ✅ Funcionalidades

**Usuário**
- Cadastro com validação de CPF (11 dígitos) e hash bcrypt na senha
- Login com JWT (1h) e bloqueio automático após 3 tentativas erradas
- Depósito, saque e transferência/PIX com validações
- Extrato completo de transações com data e hora
- Consulta de saldo em tempo real

**Gestão** *(backend pronto — frontend na Fase 2)*
- Cadastro de gestores com email corporativo (@bankjs.com.br)
- Autenticação com JWT separado
- Listagem, busca e bloqueio de contas de usuários
- Visualização de todas as transações

**Segurança**
- Senhas armazenadas com hash bcrypt
- Autenticação via JWT em todas as rotas protegidas
- Queries parametrizadas contra SQL injection
- Credenciais no `.env` — nunca expostas no código
- CORS configurado para produção

## 🗄️ Banco de dados

PostgreSQL com SQL puro via biblioteca `pg` — sem ORM, para construção sólida de fundamentos SQL.

**Tabelas:**
- `users` — dados do usuário, saldo, tentativas e status de bloqueio
- `extratouser` — transações vinculadas por chave estrangeira
- `managers` — gestores com autenticação separada

## 🛠️ Stack

**Backend**
- Node.js + Express 5
- PostgreSQL + `pg` (SQL puro)
- JWT (`jsonwebtoken`)
- bcrypt
- dotenv
- CORS

**Frontend**
- React + Vite
- Tailwind CSS v4
- React Router DOM
- Axios

**Deploy**
- Railway (backend + PostgreSQL + frontend)

## 🗺️ Roadmap

- ✅ Fase 1 — Sistema de terminal
- ✅ Fase 2 — API REST com Express
- ✅ Fase 3 — Refatoração em módulos
- ✅ Fase 4 — Área de gestão (backend)
- ✅ Fase 5 — Autenticação JWT + bcrypt
- ✅ Fase 6 — Migração para PostgreSQL
- ✅ Fase 7 — Deploy no Railway
- ✅ Fase 8 — Frontend React
- ⏳ Fase 9 — Refatoração MVC + área de gestão (frontend) + novas features

## 🚀 Como rodar localmente

```bash
# Instalar dependências do backend
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Preencha DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD e JWT_SECRET

# Rodar o servidor
node server/server.js

# Frontend
cd frontend
npm install
npm run dev