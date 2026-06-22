import express from 'express'
import { depositar } from '../User/src/operations.js';
import { sacar } from '../User/src/operations.js';
import { carregarContas, salvarContas } from '../User/src/accountsUser.js';
import { dataHora } from '../User/src/utils.js';
import { carregarContasGestao, salvarContasGestao} from '../Management/src/accountsManagement.js'
import { fraudeSenha } from '../User/src/security.js';
import { autenticadorManager } from './middlewares/auth.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

let contasGestao = [];
let contasUser = [];

contasGestao = carregarContasGestao()
contasUser = carregarContas()
const app = express()
app.use(express.json())

// ROTA DE CADASTRO
app.post('/cadastroUsuario', (req, res) => {
    const {tipo, cpf, nome, senha} = req.body

        const cpfduplicado = contasUser.find(usuario => usuario.cpf === cpf)
            if (cpfduplicado){
                return res.json ({ erro: "CPF já cadastrado!"})
            }

            contasUser.push({
                tipo: tipo,
                cpf: cpf,
                nome: nome,
                senha: senha,
                saldo: 0,
                extrato: [],
                tentativasSenha: 0, 
                tentativaFraudeSaque: 0,    
                pontosFraude: 0,
                saquesConsecutivos: 0,
                bloqueado: false 
            }) 

            salvarContas(contasUser)  

    res.json({ mensagem: `Usuário cadastrado com sucesso!`})

})

// ROTA DE CADASTRO DE GESTÃO
app.post('/cadastroGestao', (req, res) => {
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

    const emailDuplicado = contasGestao.find(gestor => gestor.email === email)
            if (emailDuplicado){
                return res.json ({ erro: "Email já cadastrado!"})
            }

    contasGestao.push({
        nome: nome,
        email: email,
        senha: senha,
        tentativasSenha: 0,
        bloqueado: false,
        tipo: tipo
    })

    salvarContasGestao(contasGestao)

    return res.json({ mensagem: `Gestor cadastrado com sucesso!`})

})

// ROTA DE LOGIN DE USUÁRIO
app.post('/loginUsuario', (req, res) => {
    const {nome, senha} = req.body
    const usuario = contasUser.find(u => u.nome === nome)

    if (!usuario) {
        return res.json({ erro: 'Usuário não encontrado!' })
    }
    fraudeSenha(usuario, senha)
    salvarContas(contasUser)
    if (usuario.bloqueado === true) {
        return res.json({ erro: "Acesso bloqueado!"})
    } 
    if (usuario.senha !== senha) {
        return res.json({ erro: "Senha inválida!"})
    }
    
    return res.json({
        nome: usuario.nome,
        tipo: usuario.tipo,
        saldo: usuario.saldo
    })

})

// ROTA DE LOGIN DE GESTÃO
app.post('/loginGestao', (req, res) => {
    const {email, senha} = req.body
    const gestor = contasGestao.find(gestorUser => gestorUser.email === email)

    
    if (!gestor) {
        return res.json({ erro: 'Gestor não encontrado!' })
    }
    fraudeSenha(gestor, senha)
    salvarContasGestao(contasGestao)
    if (gestor.bloqueado === true) {
        return res.json({ erro: "Acesso bloqueado!"})
    } 
    if (gestor.senha !== senha) {
        return res.json({ erro: "Senha inválida!"})
    }
  
    if (!gestor.email.endsWith("@bankjs.com.br")) {
        return res.json({ erro: 'Email inválido!'})
    } 
    if (gestor.senha.length < 8) {
        return res.json({ erro: "Senha inválida!"})
    }

    const token = jwt.sign(
        {email: gestor.email,
            tipo: gestor.tipo,},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )
    res.json({
        token: token,
        email: gestor.email,
        tipo: gestor.tipo
    })
})

// ROTA DE LISTA DE CONTAS CADASTRADAS 
app.get('/gerente/contas', autenticadorManager, (req, res) => {
    return res.json(contasUser)
})

// ROTA BUSCA DE CONTA POR CPF
app.get('/gerente/contas/:cpf', autenticadorManager, (req,res) => {
    const {cpf} = req.params
    const usuario = contasUser.find(buscarConta => buscarConta.cpf === cpf)

    if(!usuario) {
        return res.json({ erro: "Usuário não encontrado!"})
    }

    return res.json(usuario)
})

// ROTA DE ACESSO AO EXTRATO DOS USUÁRIOS
app.get('/gerente/transacoes', autenticadorManager, (req, res) => {
    const extratos = contasUser.map(usuario => usuario.extrato)

    return res.json(extratos)
})

// ROTA DE DEPÓSITO DE USUÁRIO
app.post('/depositarUsuario', (req, res) => {
    const {cpf, valorDepositar} = req.body
    const usuario = contasUser.find(buscaConta => buscaConta.cpf === cpf)

    if (!usuario) {
        return res.json({ erro: 'Usuário não encontrado!' })
    }

    if (valorDepositar <= 0) {
       return res.json({ erro: "Valor inválido!"})
    }

    usuario.saldo = depositar(usuario.saldo, valorDepositar)
    usuario.extrato.push({
        tipo: "Depósito",
        valor: valorDepositar,
        data: dataHora(),
        saldo: usuario.saldo
    })
    
    salvarContas(contasUser)

    return res.json({
        saldo: usuario.saldo
    })
    
})

// ROTA DE SAQUE DE USUÁRIO
app.post('/sacarUsuario', (req, res) => {
    const {cpf, valorSaque} = req.body
    const usuario = contasUser.find(u => u.cpf === cpf)

    if (!usuario) {
        return res.json({ erro: 'Usuário não encontrado!' })
    }
    if (valorSaque <= 0) {
        return res.json({ erro: "Valor inválido!"})
    }

    if (valorSaque > 1000) {
        return res.json({ erro: "Valor inválido!"})
    }

    usuario.saldo = sacar(usuario.saldo, valorSaque)
    usuario.extrato.push({
        tipo: "Saque",
        valor: valorSaque,
        data: dataHora(),
        saldo: usuario.saldo
    });
    
    salvarContas(contasUser)

    return res.json({
        saldo: usuario.saldo
    })
    
})

// ROTA DE TRANSFERÊNCIA DO USUÁRIO
app.post('/transferir', (req, res) => {
    const {cpf, cpfDestino, valorTransferencia} = req.body
    const usuario = contasUser.find(buscaConta => buscaConta.cpf === cpf)
    const contaDestino = contasUser.find(buscaContaDestino => buscaContaDestino.cpf === cpfDestino)

    if (!usuario) {
        return res.json({ erro: 'Usuário não encontrado!' })
    }
    if (!contaDestino) {
        return res.json({ erro: 'Conta destino não encontrada!' })
    }
    if (valorTransferencia <= 0) {
        return res.json({ erro: "Valor inválido!"})
    }
    if (usuario.saldo < valorTransferencia) {
        return res.json({ erro: "Saldo insuficiente!"})
    } else {
        usuario.saldo -= valorTransferencia
        usuario.extrato.push({
            tipo: "Realizou transferência",
            valor: valorTransferencia,
            data: dataHora(),
            saldo: usuario.saldo
        });
        contaDestino.saldo += valorTransferencia
        contaDestino.extrato.push({
            tipo: "Recebeu transferência",
            valor: valorTransferencia,
            data: dataHora(),
            saldo: contaDestino.saldo
        });
        salvarContas(contasUser)
        return res.json({
        saldo: usuario.saldo
        })
    }       
})

// ROTA DE EXTRATO DO USUÁRIO
app.get('/extratoUsuario', (req, res) => {
    const {cpf} = req.body
    const usuario = contasUser.find(buscaConta => buscaConta.cpf === cpf)
    
    if (!usuario) {
        return res.json({ erro: 'Usuário não encontrado!' })
    }

    return res.json(usuario.extrato)
})

// ROTA DE SALDO DO USUÁRIO
app.get('/saldo', (req, res) => {
    const {cpf} = req.body
    const usuario = contasUser.find(buscarConta => buscarConta.cpf === cpf)

    if(!usuario) {
        return res.json({ erro: "Usuário não encontrado!"})
    }

    return res.json(usuario.saldo)
})

// ROTA DE BLOQUEIO/DESBLOQUEIO CARTÃO DO USUÁRIO
app.put('/gerente/bloquear/:cpf', autenticadorManager, (req, res) => {
    const {cpf} = req.params
    const usuario = contasUser.find(buscarConta => buscarConta.cpf === cpf)

    if(!usuario) {
        return res.json({ erro: "Usuário não encontrado!"})
    }
    
    usuario.bloqueado = !usuario.bloqueado

    salvarContas(contasUser)
    return res.json( {mensagem : usuario.bloqueado ? 'Usuário bloqueado!' : 'Usuário desbloqueado!'})
})

app.listen(3000, () => {
    console.log("Servidor rodando!")
})