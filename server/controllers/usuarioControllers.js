import pool from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { fraudeSenha } from '../../Functions/security.js'
import { depositar, sacar } from '../../Functions/operations.js'
import { dataHora } from '../../Functions/utils.js'

export async function loginUsuario(req, res) {
    const {cpf, senha} = req.body
    const usuario = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])
    
    if (usuario.rows.length === 0) {
        return res.status(404).json({ erro: 'Usuário não encontrado!' })
    }

    if (usuario.rows[0].bloqueado === true) {
        return res.status(403).json({ erro: "Acesso bloqueado!"})
    }

    const validacaoSenha = await fraudeSenha(usuario.rows[0], senha)
    await pool.query('UPDATE users SET tentativas_senha = $1, bloqueado = $2 WHERE cpf = $3', [usuario.rows[0].tentativas_senha, usuario.rows[0].bloqueado, usuario.rows[0].cpf])

    if (!validacaoSenha) {
        return res.status(401).json({ erro: 'Senha inválida!'})
    }

    const token = jwt.sign(
        {cpf: usuario.rows[0].cpf,
            tipo: usuario.rows[0].tipo,},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )
    res.json({
        token: token,
        cpf: cpf,
        tipo: usuario.rows[0].tipo,
        saldo: usuario.rows[0].saldo
    })
}

export async function cadastroUsuario(req, res) {
    const {tipo, cpf, nome, senha} = req.body

        const cpfduplicado = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])
            if (cpfduplicado.rows.length > 0){
                return res.status(409).json ({ erro: "CPF já cadastrado!"})
            }
            if (cpf.length !== 11) {
                return res.status(400).json({ erro: 'CPF inválido!'})
            }

            const senhaHash = await bcrypt.hash(senha, 10)

            await pool.query('INSERT INTO users (tipo, cpf, nome, senha) VALUES ($1, $2, $3, $4)',[
                tipo,
                cpf,
                nome,
                senhaHash
            ])   

    res.json({ mensagem: `Usuário cadastrado com sucesso!`})
}

export async function saldo(req, res) {
    const cpf = req.cpf
    const usuario = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])
    if(usuario.rows.length === 0) {
        return res.status(404).json({ erro: "Usuário não encontrado!"})
    }

    return res.json(usuario.rows[0].saldo)
}

export async function extratoUsuario(req, res) {
        const cpf = req.cpf
        const usuario = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])

        if (usuario.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' })
        }

        const usuarioExtrato = await pool.query('SELECT * FROM extratouser WHERE user_id = $1', [usuario.rows[0].id])
        return res.json(usuarioExtrato.rows)
}

export async function depositarUsuario(req, res) {
    const {cpf, valorDepositar} = req.body
    const usuario = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])

    if (usuario.rows.length === 0) {
        return res.status(404).json({ erro: 'Usuário não encontrado!' })
    }

    if (valorDepositar <= 0) {
       return res.status(400).json({ erro: "Valor inválido!"})
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
}

export async function sacarUsuario(req, res) {
        const {cpf, valorSaque} = req.body
        const usuario = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])


        if (usuario.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' })
        }
        if (valorSaque <= 0) {
            return res.status(400).json({ erro: "Valor inválido!"})
        }

        if (valorSaque > 1000) {
            return res.status(400).json({ erro: "Limite de saque excedido!"})
        }

        if (valorSaque > usuario.rows[0].saldo) {
            return res.status(400).json({ erro: "Saldo insulficiente!"})
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
}

export async function transferir(req, res) {
    const cpf = req.cpf
    const {cpfDestino, valorTransferencia} = req.body
    const usuario = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf])
    const contaDestino = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpfDestino])

    if (usuario.rows.length === 0) {
        return res.status(404).json({ erro: 'Usuário não encontrado!' })
    }
    if (contaDestino.rows.length === 0) {
        return res.status(404).json({ erro: 'Conta destino não encontrada!' })
    }
    if (Number(valorTransferencia) <= 0) {
        return res.status(400).json({ erro: "Valor inválido!"})
    }
    if (Number(usuario.rows[0].saldo) < Number(valorTransferencia)) {
        return res.status(400).json({ erro: "Saldo insuficiente!"})
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
}