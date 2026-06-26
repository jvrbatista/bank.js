import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export function autenticadorManager(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    let tokenDecodificado
    if (!token) {
        return res.json({ erro: 'Token não encontrado!' })
    }

    try {
        tokenDecodificado = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.json({ erro: 'Token inválido!' })
    }

    const { email, tipo } = tokenDecodificado

    if (tipo !== "gerente") {
        return res.json({ erro: 'Acesso negado!'})
    }
    
    next()
}

export function autenticadorUser(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    let tokenDecodificado
    if (!token) {
        return res.json({ erro: 'Token não encontrado!' })
    }

    try {
        tokenDecodificado = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.json({ erro: 'Token inválido!' })
    }

    const { cpf, tipo } = tokenDecodificado

    if (tipo !== "Corrente" && tipo !== "Poupança") {
        return res.json({ erro: 'Acesso negado!'})
    }
    
    next()
}