import express from 'express'
import { depositar } from '../Functions/operations.js';
import { sacar } from '../Functions/operations.js';
import { dataHora } from '../Functions/utils.js';
import { fraudeSenha } from '../Functions/security.js';
import { autenticadorManager, autenticadorUser } from './middlewares/auth.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import './db.js'
import pool from './db.js'
dotenv.config()

const app = express()
app.use(express.json())

// ROTA DE CADASTRO
app.post('/cadastroUsuario', async (req, res) => {
    const {tipo, cpf, nome, senha} = req.body

        const cpfduplicado = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])
            if (cpfduplicado.rows.length > 0){
                return res.json ({ erro: "CPF já cadastrado!"})
            }

            const senhaHash = await bcrypt.hash(senha, 10)

            await pool.query('INSERT INTO users (tipo, cpf, nome, senha) VALUES ($1, $2, $3, $4)',[
                tipo,
                cpf,
                nome,
                senhaHash
            ])   

    res.json({ mensagem: `Usuário cadastrado com sucesso!`})

})

// ROTA DE CADASTRO DE GESTÃO
app.post('/cadastroGestao', async (req, res) => {
    const {nome, email, senha, tipo} = req.body

    if (!email.endsWith("@bankjs.com.br")) {
        return res.json({ erro: 'Email inválido!'})
    }

    if (senha.length < 8) {
        return res.json({ erro: "Senha inválida!"})
    }
    
    if (!nome.includes(" ")) {
        return res.json({ erro: "Nome inválido!"})
    }

    const emailDuplicado = await pool.query('SELECT * FROM managers WHERE email = $1', [email])
            if (emailDuplicado.rows.length > 0 ){
                return res.json ({ erro: "Email já cadastrado!"})
            }
    
    const senhaHash = await bcrypt.hash(senha, 10)

    await pool.query('INSERT INTO managers (nome, email, senha, tipo) VALUES ($1, $2, $3, $4)',[
                nome,
                email,
                senhaHash,
                tipo
            ])   

    return res.json({ mensagem: `Gestor cadastrado com sucesso!`})

})

// ROTA DE LOGIN DE USUÁRIO
app.post('/loginUsuario', async (req, res) => {
    const {nome, senha} = req.body
    const usuario = await pool.query('SELECT * FROM users WHERE nome = $1', [nome])

    if (usuario.rows.length === 0) {
        return res.json({ erro: 'Usuário não encontrado!' })
    }
    
    await fraudeSenha(usuario.rows[0], senha)
    await pool.query('UPDATE users SET tentativas_senha = $1, bloqueado = $2 WHERE cpf = $3', [usuario.rows[0].tentativas_senha, usuario.rows[0].bloqueado, usuario.rows[0].cpf])
    if (usuario.rows[0].bloqueado === true) {
        return res.json({ erro: "Acesso bloqueado!"})
    } 

    let validacaoSenha = await bcrypt.compare(senha, usuario.rows[0].senha)
    if (validacaoSenha === false) {
        return res.json({ erro: 'Senha inválida!'})
    }
    
    const token = jwt.sign(
        {cpf: usuario.rows[0].cpf,
            tipo: usuario.rows[0].tipo,},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )
    res.json({
        token: token,
        nome: nome,
        tipo: usuario.rows[0].tipo,
        saldo: usuario.rows[0].saldo
    })
})

// ROTA DE LOGIN DE GESTÃO
app.post('/loginGestao', async (req, res) => {
    const {email, senha} = req.body
    const gestor = await pool.query('SELECT * FROM managers WHERE email = $1', [email])

    
    if (gestor.rows.length === 0) {
        return res.json({ erro: 'Gestor não encontrado!' })
    }
    await fraudeSenha(gestor.rows[0], senha)
    await pool.query('UPDATE managers SET tentativas_senha = $1, bloqueado = $2 WHERE email = $3', [gestor.rows[0].tentativas_senha, gestor.rows[0].bloqueado, gestor.rows[0].email])
    if (gestor.rows[0].bloqueado === true) {
        return res.json({ erro: "Acesso bloqueado!"})
    } 

    if (!gestor.rows[0].email.endsWith("@bankjs.com.br")) {
        return res.json({ erro: 'Email inválido!'})
    }

    let validacaoSenha = await bcrypt.compare(senha, gestor.rows[0].senha)
    if (validacaoSenha === false) {
        return res.json({ erro: "Senha inválida!"})
    }

    const token = jwt.sign(
        {email: gestor.rows[0].email,
            tipo: gestor.rows[0].tipo,},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )
    res.json({
        token: token,
        email: gestor.rows[0].email,
        tipo: gestor.rows[0].tipo
    })
})

// ROTA DE LISTA DE CONTAS CADASTRADAS 
app.get('/gerente/contas', autenticadorManager, async (req, res) => {
    const contasCadastro = await pool.query('SELECT * FROM users')
    return res.json(contasCadastro.rows)
})

// ROTA BUSCA DE CONTA POR CPF
app.get('/gerente/contas/:cpf', autenticadorManager, async (req,res) => {
    const {cpf} = req.params
    const usuario = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])

    if(usuario.rows.length === 0) {
        return res.json({ erro: "Usuário não encontrado!"})
    }

    return res.json(usuario.rows)
})

// ROTA DE ACESSO AO EXTRATO DOS USUÁRIOS
app.get('/gerente/transacoes', autenticadorManager, async (req, res) => {
    const extratos = await pool.query('SELECT * FROM extratouser')

    return res.json(extratos.rows)
})

// ROTA DE DEPÓSITO DE USUÁRIO
app.post('/depositarUsuario', autenticadorUser,async (req, res) => {
    const {cpf, valorDepositar} = req.body
    const usuario = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])

    if (usuario.rows.length === 0) {
        return res.json({ erro: 'Usuário não encontrado!' })
    }

    if (valorDepositar <= 0) {
       return res.json({ erro: "Valor inválido!"})
    }

    usuario.rows[0].saldo = depositar(Number(usuario.rows[0].saldo), Number(valorDepositar))
    await pool.query('UPDATE users SET saldo = $1 WHERE cpf = $2', [usuario.rows[0].saldo, usuario.rows[0].cpf])

    await pool.query('INSERT INTO extratouser (tipo, valor, data, saldo, user_id) VALUES ($1, $2, $3, $4, $5)', [
                'DEPÓSITO',
                valorDepositar,
                dataHora(),
                usuario.rows[0].saldo,
                usuario.rows[0].id
            ])

    return res.json({
        saldo: usuario.rows[0].saldo
    }) 
})

// ROTA DE SAQUE DE USUÁRIO
app.post('/sacarUsuario', autenticadorUser,async (req, res) => {
    const {cpf, valorSaque} = req.body
    const usuario = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])


    if (usuario.rows.length === 0) {
        return res.json({ erro: 'Usuário não encontrado!' })
    }
    if (valorSaque <= 0) {
        return res.json({ erro: "Valor inválido!"})
    }

    if (valorSaque > 1000) {
        return res.json({ erro: "Valor inválido!"})
    }
    if (valorSaque > usuario.rows[0].saldo) {
        return res.json({ erro: "Saldo insulficiente!"})
    }

    usuario.rows[0].saldo = sacar(Number(usuario.rows[0].saldo), Number(valorSaque))
    await pool.query('UPDATE users SET saldo = $1  WHERE cpf = $2', [usuario.rows[0].saldo, usuario.rows[0].cpf])
    
    await pool.query('INSERT INTO extratouser (tipo, valor, data, saldo, user_id) VALUES ($1, $2, $3, $4, $5)', [
                'SAQUE',
                valorSaque,
                dataHora(),
                usuario.rows[0].saldo,
                usuario.rows[0].id
            ])

    return res.json({
        saldo: usuario.rows[0].saldo
    })  
})

// ROTA DE TRANSFERÊNCIA DO USUÁRIO
app.post('/transferir', autenticadorUser,async (req, res) => {
    const {cpf, cpfDestino, valorTransferencia} = req.body
    const usuario = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])
    const contaDestino = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpfDestino])

    if (usuario.rows.length === 0) {
        return res.json({ erro: 'Usuário não encontrado!' })
    }
    if (contaDestino.rows.length === 0) {
        return res.json({ erro: 'Conta destino não encontrada!' })
    }
    if (valorTransferencia <= 0) {
        return res.json({ erro: "Valor inválido!"})
    }
    if (usuario.rows[0].saldo < valorTransferencia) {
        return res.json({ erro: "Saldo insuficiente!"})
    } 

    usuario.rows[0].saldo = Number(usuario.rows[0].saldo) - Number(valorTransferencia)
    await pool.query('UPDATE users SET saldo = $1  WHERE cpf = $2', [usuario.rows[0].saldo, usuario.rows[0].cpf])
    
    await pool.query('INSERT INTO extratouser (tipo, valor, data, saldo, user_id) VALUES ($1, $2, $3, $4, $5)', [
            'TRANSFERIU',
            valorTransferencia,
            dataHora(),
            usuario.rows[0].saldo,
            usuario.rows[0].id
        ])

    contaDestino.rows[0].saldo = Number(contaDestino.rows[0].saldo) + Number(valorTransferencia)
    await pool.query('UPDATE users SET saldo = $1  WHERE cpf = $2', [contaDestino.rows[0].saldo, contaDestino.rows[0].cpf])
    
    await pool.query('INSERT INTO extratouser (tipo, valor, data, saldo, user_id) VALUES ($1, $2, $3, $4, $5)', [
            'RECEBEU',
            valorTransferencia,
            dataHora(),
            contaDestino.rows[0].saldo,
            contaDestino.rows[0].id
        ])

    return res.json({
    saldo: usuario.rows[0].saldo
    })        
})

// ROTA DE EXTRATO DO USUÁRIO
app.get('/extratoUsuario', autenticadorUser,async (req, res) => {
    const {cpf} = req.body
    const usuario = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])

    if (usuario.rows.length === 0) {
        return res.json({ erro: 'Usuário não encontrado!' })
    }

    const usuarioExtrato = await pool.query('SELECT * FROM extratouser WHERE user_id = $1', [usuario.rows[0].id])
    return res.json(usuarioExtrato.rows)
})

// ROTA DE SALDO DO USUÁRIO
app.get('/saldo', autenticadorUser,async (req, res) => {
    const {cpf} = req.body
    const usuario = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])
    if(usuario.rows.length === 0) {
        return res.json({ erro: "Usuário não encontrado!"})
    }

    return res.json(usuario.rows[0].saldo)
})

// ROTA DE BLOQUEIO/DESBLOQUEIO CARTÃO DO USUÁRIO
app.put('/gerente/bloquear/:cpf', autenticadorManager, async(req, res) => {
    const {cpf} = req.params
    const usuario = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])
    if(usuario.rows.length === 0) {
        return res.json({ erro: "Usuário não encontrado!"})
    }
    
    usuario.rows[0].bloqueado = !usuario.rows[0].bloqueado
    await pool.query('UPDATE users SET bloqueado = $1 WHERE cpf = $2', [usuario.rows[0].bloqueado, usuario.rows[0].cpf])

    return res.json( {mensagem : usuario.rows[0].bloqueado ? 'Usuário bloqueado!' : 'Usuário desbloqueado!'})
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})