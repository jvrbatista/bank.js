import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import pool from '../db.js'
dotenv.config()

export function autenticadorManager(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    let tokenDecodificado
    if (!token) {
        return res.status(401).json({ erro: 'Token não encontrado!' })
    }

    try {
        tokenDecodificado = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.status(401).json({ erro: 'Token inválido!' })
    }

    const { email, tipo } = tokenDecodificado

    if (tipo !== "gerente") {
        return res.status(403).json({ erro: 'Acesso negado!'})
    }
    
    next()
}

export async function autenticadorUser(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    let tokenDecodificado
    if (!token) {
        return res.status(401).json({ erro: 'Token não encontrado!' })
    }

    try {
        tokenDecodificado = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.status(401).json({ erro: 'Token inválido!' })
    }

    const { cpf, tipo } = tokenDecodificado

    if (tipo !== "Corrente" && tipo !== "Poupança") {
        return res.status(403).json({ erro: 'Acesso negado!'})
    }

    const usuario = await pool.query('SELECT bloqueado FROM users WHERE cpf = $1', [cpf])
    if (usuario.rows[0]?.bloqueado === true) {
        return res.status(403).json({ erro: 'Conta bloqueada!' }) 
    }
    
    req.cpf = cpf
    next()
}