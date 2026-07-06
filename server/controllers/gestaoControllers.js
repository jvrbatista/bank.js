import pool from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { fraudeSenha } from '../../Functions/security.js'

export async function loginGestao(req, res) {
    const {email, senha} = req.body
    const gestor = await pool.query('SELECT * FROM managers WHERE email = $1', [email])

    
    if (gestor.rows.length === 0) {
        return res.status(404).json({ erro: 'Gestor não encontrado!' })
    }

    if (gestor.rows[0].bloqueado === true) {
        return res.status(403).json({ erro: "Acesso bloqueado!"})
    }

    const validacaoSenha = await fraudeSenha(gestor.rows[0], senha)
    await pool.query('UPDATE managers SET tentativas_senha = $1, bloqueado = $2 WHERE email = $3', [gestor.rows[0].tentativas_senha, gestor.rows[0].bloqueado, gestor.rows[0].email])
    
    if (validacaoSenha === false) {
        return res.status(401).json({ erro: "Senha inválida!"})
    }

    if (!gestor.rows[0].email.endsWith("@bankjs.com.br")) {
        return res.status(400).json({ erro: 'Email inválido!'})
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
}

export async function cadastroGestao(req, res) {
    const {nome, email, senha, tipo} = req.body

    if (!email.endsWith("@bankjs.com.br")) {
        return res.status(400).json({ erro: 'Email inválido!'})
    }

    if (senha.length < 8) {
        return res.status(400).json({ erro: "Senha inválida!"})
    }
    
    if (!nome.includes(" ")) {
        return res.status(400).json({ erro: "Nome inválido!"})
    }

    const emailDuplicado = await pool.query('SELECT * FROM managers WHERE email = $1', [email])
            if (emailDuplicado.rows.length > 0 ){
                return res.status(409).json ({ erro: "Email já cadastrado!"})
            }
    
    const senhaHash = await bcrypt.hash(senha, 10)

    await pool.query('INSERT INTO managers (nome, email, senha, tipo) VALUES ($1, $2, $3, $4)',[
                nome,
                email,
                senhaHash,
                tipo
            ])   

    return res.json({ mensagem: `Gestor cadastrado com sucesso!`})
}

export async function buscarContaPorCpf(req, res) {
    const {cpf} = req.params
    const usuario = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])

    if(usuario.rows.length === 0) {
        return res.status(404).json({ erro: "Usuário não encontrado!"})
    }

    return res.json(usuario.rows)
}

export async function buscarContas(req, res) {
    const contasCadastro = await pool.query('SELECT * FROM users')
    return res.json(contasCadastro.rows)
}

export async function buscarExtrato(req, res) {
    const extratos = await pool.query('SELECT * FROM extratouser')

    return res.json(extratos.rows)
}

export async function bloquearContaPorCpf(req, res) {
    const {cpf} = req.params
    const usuario = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])
    if(usuario.rows.length === 0) {
        return res.status(404).json({ erro: "Usuário não encontrado!"})
    }
    
    usuario.rows[0].bloqueado = !usuario.rows[0].bloqueado
    await pool.query('UPDATE users SET bloqueado = $1 WHERE cpf = $2', [usuario.rows[0].bloqueado, usuario.rows[0].cpf])

    return res.json( {mensagem : usuario.rows[0].bloqueado ? 'Usuário bloqueado!' : 'Usuário desbloqueado!'})
}