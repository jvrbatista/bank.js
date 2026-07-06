# BankJS 🏦

![Status](https://img.shields.io/badge/status-fase%201%20completa-brightgreen)

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)

![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)

![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)

![Railway](https://img.shields.io/badge/Railway-0B0D0E?logo=railway&logoColor=white)

![License](https://img.shields.io/badge/licença-MIT-blue)

**Aplicação bancária digital full stack — do terminal ao deploy em produção.**

---

## 📌 Sobre o projeto

O BankJS é uma aplicação bancária digital construída do zero como projeto de portfólio. O objetivo foi aplicar na prática conceitos reais de desenvolvimento backend: autenticação segura, banco de dados relacional, arquitetura REST e deploy em nuvem.

O projeto evoluiu em fases — começou como um sistema de terminal em JavaScript puro e se tornou uma aplicação full stack completa, com frontend em React e backend deployado no Railway.

---

## 🔗 Deploy

| Serviço | URL |
|---|---|
| Frontend | [bankjs-app-production.up.railway.app](https://bankjs-app-production.up.railway.app) |
| Backend | [bankjs-production.up.railway.app](https://bankjs-production.up.railway.app) |

---

## ✅ Funcionalidades

### Usuário
- Cadastro com validação de CPF (exatamente 11 dígitos) e verificação de duplicidade
- Login com autenticação JWT (expira em 1h)
- Bloqueio automático após 3 tentativas de senha incorretas
- Depósito, saque e transferência via PIX com validações de saldo
- Extrato completo de transações com data/hora no fuso de Brasília
- Consulta de saldo em tempo real

### Gestão *(backend pronto — frontend na Fase 2)*
- Cadastro de gestores com email corporativo obrigatório (`@bankjs.com.br`)
- Autenticação separada com JWT próprio
- Rotas administrativas protegidas por middleware específico

### Segurança
- Senhas armazenadas com hash **bcrypt** — nunca em texto puro
- Todas as rotas protegidas com **JWT** via middleware
- Queries **parametrizadas** — prevenção de SQL injection
- **CORS** configurado para aceitar apenas origens autorizadas
- Credenciais em variáveis de ambiente — nunca expostas no código

---

## 🛠️ Stack

### Backend
- **Node.js** + **Express 5** com ES Modules
- **PostgreSQL** via biblioteca `pg` — SQL puro, sem ORM
- **JWT** (`jsonwebtoken`) para autenticação stateless
- **bcrypt** para hash de senhas
- **dotenv** para variáveis de ambiente
- **CORS** para controle de origens

### Frontend
- **React** + **Vite**
- **Tailwind CSS v4** via plugin Vite
- **React Router DOM** para navegação SPA
- **Axios** para requisições HTTP

### Infraestrutura
- **Railway** — backend, frontend e PostgreSQL gerenciado

---

## 🗄️ Banco de dados

PostgreSQL com SQL puro — escolha intencional para construir fundamentos sólidos sem a abstração de ORMs.

### Tabelas

**`users`**
| Coluna | Tipo | Descrição |
|---|---|---|
| id | SERIAL | Chave primária |
| tipo | VARCHAR | Corrente ou Poupança |
| nome | VARCHAR | Nome completo |
| cpf | VARCHAR(11) | CPF único |
| senha | VARCHAR | Hash bcrypt |
| saldo | NUMERIC | Saldo atual |
| tentativas_senha | INT | Contador de tentativas incorretas |
| bloqueado | BOOLEAN | Status de bloqueio |

**`extratouser`**
| Coluna | Tipo | Descrição |
|---|---|---|
| id | SERIAL | Chave primária |
| user_id | INT | FK → users.id |
| tipo | VARCHAR | DEPÓSITO, SAQUE, TRANSFERIU, RECEBEU |
| valor | NUMERIC | Valor da transação |
| data | VARCHAR | Data/hora formatada (pt-BR) |
| saldo | NUMERIC | Saldo após a transação |

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL instalado e rodando

### Instalação

```bash
# Clone o repositório
git clone https://github.com/jvrbatista/bank.js.git
cd bank.js

# Instale as dependências do backend
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais
```

### Variáveis de ambiente

```env
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
JWT_SECRET=sua_chave_secreta_aqui
NODE_ENV=development
```

### Executando

```bash
# Backend (porta 3000)
node server/server.js

# Frontend (porta 5173)
cd frontend
npm install
npm run dev
```

---

## 📡 Endpoints da API

### Usuário
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/cadastroUsuario` | Cadastrar usuário | ❌ |
| POST | `/loginUsuario` | Login e geração de JWT | ❌ |
| GET | `/saldo` | Consultar saldo | ✅ |
| GET | `/extratoUsuario` | Listar transações | ✅ |
| POST | `/depositar` | Realizar depósito | ✅ |
| POST | `/sacar` | Realizar saque | ✅ |
| POST | `/transferir` | Transferência via PIX | ✅ |

### Gestão
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/cadastroGestao` | Cadastrar gestor | ❌ |
| POST | `/loginGestao` | Login de gestor | ❌ |

> ✅ Requer header `Authorization: Bearer <token>`

---

## 🗺️ Roadmap

- ✅ **Fase 1** — Sistema de terminal em JavaScript puro
- ✅ **Fase 2** — Migração para API REST com Express
- ✅ **Fase 3** — Refatoração em módulos (operations, security, utils)
- ✅ **Fase 4** — Área de gestão no backend
- ✅ **Fase 5** — Autenticação JWT + bcrypt
- ✅ **Fase 6** — Migração para PostgreSQL com SQL puro
- ✅ **Fase 7** — Deploy no Railway
- ✅ **Fase 8** — Frontend React com 4 páginas funcionais
- ✅ **Fase 9** — Refatoração MVC (routes/controllers)
- ⏳ **Fase 10** — Área de gestão no frontend + tratamento de erros robusto + novas features

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  Feito por <a href="https://github.com/jvrbatista">João Victor</a>
</div>
