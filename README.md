# BankJS 💰

Sistema bancário construído em JavaScript puro (Node.js) — do terminal até uma API REST funcional.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-green)
![Node.js](https://img.shields.io/badge/Node.js-green?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-green?logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-green?logo=javascript&logoColor=white)
![License](https://img.shields.io/badge/licença-MIT-green)

## Sobre o projeto

O BankJS começou como um sistema de terminal e evoluiu para uma API REST completa com área administrativa. O objetivo final é se tornar um sistema bancário web com frontend, banco de dados e autenticação JWT.

## Roadmap

- ✅ Fase 1 — Terminal
- ✅ Fase 2 — API REST
- ✅ Fase 3 — Refatoração em módulos
- ✅ Fase 4 — Área do gestor
- ⏳ Fase 5 — Autenticação JWT + bcrypt
- ⏳ Fase 6 — Banco de dados PostgreSQL + Prisma
- ⏳ Fase 7 — Deploy Railway
- ⏳ Fase 8 — Frontend React

## Funcionalidades

**Usuário**
- Cadastro com validação de CPF duplicado e tipo de conta
- Login com autenticação e bloqueio por tentativas incorretas
- Saque com validação de saldo e valor
- Depósito com validação de valor
- Transferência entre contas via CPF
- Extrato de transações com data e hora
- Persistência de dados em arquivo JSON

**Gestão**
- Cadastro de gestores com validação de email corporativo
- Login exclusivo para gestores com domínio @bankjs.com.br
- Listagem de todas as contas de usuários
- Consulta detalhada de conta por CPF
- Bloqueio e desbloqueio de contas via toggle
- Visualização de todas as transações do sistema

**Segurança**
- Detector de fraude automático
- Bloqueio de conta por tentativas incorretas de senha
- Bloqueio por atividade suspeita em saques

## Como rodar

```bash
npm install
node server/server.js
```

Servidor disponível em `http://localhost:3000`

## Rotas da API

### Usuário

| Método | Rota | Descrição |
|---|---|---|
| POST | /cadastrar | Cria uma nova conta |
| POST | /login | Autentica o usuário |
| POST | /depositar | Realiza um depósito |
| POST | /sacar | Realiza um saque |
| POST | /transferir | Transfere entre contas |
| GET | /saldo | Consulta o saldo |
| GET | /extrato | Busca o extrato completo |

### Gestão

| Método | Rota | Descrição |
|---|---|---|
| POST | /cadastroGestao | Cadastra um novo gestor |
| POST | /loginGestao | Autentica um gestor |
| GET | /gerente/contas | Lista todas as contas |
| GET | /gerente/conta/:cpf | Detalha uma conta específica |
| PUT | /gerente/bloquear/:cpf | Bloqueia ou desbloqueia uma conta |
| GET | /gerente/transacoes | Lista todas as transações |

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

**POST /cadastroGestao**
```json
{
  "nome": "João Victor",
  "email": "joao@bankjs.com.br",
  "senha": "bank@123"
}
```

**PUT /gerente/bloquear/:cpf**
```
/gerente/bloquear/12345678900
```

## Regras de negócio

- Tipo de conta: Corrente ou Poupança
- CPF único por cadastro de usuário
- Gestores autenticados por email @bankjs.com.br
- Senha de gestor com mínimo 8 caracteres

## Regras de segurança

- 3 tentativas incorretas de senha bloqueiam a conta automaticamente
- Saques acima de R$1.000 geram ponto de fraude
- 3 saques consecutivos geram ponto de fraude
- 2 pontos de fraude bloqueiam o cartão automaticamente
- Conta bloqueada impede login

## Tecnologias

- Node.js
- JavaScript ES Modules
- Express.js
- fs (File System)
