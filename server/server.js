import express from 'express'
import { depositar } from '../User/src/operations.js';
import { sacar } from '../User/src/operations.js';
import { carregarContas, salvarContas } from '../User/src/accountsUser.js';
import { dataHora } from '../User/src/utils.js';
import { carregarContasGestao, salvarContasGestao} from '../Management/src/accountsManagement.js'

let contasGestao = [];
let contasUser = [];

contasGestao = carregarContasGestao()
contasUser = carregarContas()
const app = express()
app.use(express.json())

app.post('/cadastrar', (req, res) => {
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

app.post('/cadastroGestao', (req, res) => {
    const {email, senha} = req.body

    const emailDuplicado = contasGestao.find(gestor => gestor.email === email)
            if (emailDuplicado){
                return res.json ({ erro: "Email já cadastrado!"})
            }

    
        
    contasGestao.push({
        nome: nome,
        email: email,
        senha: senha,
    })

})

app.post('/login', (req, res) => {
    const {nome, senha} = req.body

    const usuario = contasUser.find(u => u.nome === nome && u.senha === senha)

    if (!usuario) {
        return res.json({ erro: 'Usuário ou senha incorretos' })
    }
    if (usuario.bloqueado) {
        return res.json({ erro: 'Conta bloqueada' })
    }
    
    return res.json({
        nome: usuario.nome,
        tipo: usuario.tipo,
        saldo: usuario.saldo
    })

})

//Rota de Login da Gestão
app.post('/loginGestao', (req, res) => {
    const {email, senha} = req.body

    const gestor = contasGestao.find(gestorUser => gestorUser.email === email && gestorUser.senha === senha)

    if (!gestor) {
        return res.json({ erro: 'Gestor não encontrado!' })
    }
    if (gestor.bloqueado) {
        return res.json({ erro: 'Gestor bloqueado!' })
    }
    if (!gestor.email.endsWith("@bankjs.com.br")) {
        return res.json({ erro: 'Email inválido!'})
    } 
    if (gestor.senha.length < 8) {
        return res.json({ erro: "Senha inválida!"})
    }

    gestor.token = crypto.randomUUID()
    salvarContasGestao(contasGestao)

    return res.json({
        token: gestor.token,
        email: gestor.email,
        tipo: gestor.tipo
    })
})



app.post('/depositar', (req, res) => {
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

app.post('/sacar', (req, res) => {
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

app.get('/extrato', (req, res) => {
    const {cpf} = req.body
    const usuario = contasUser.find(buscaConta => buscaConta.cpf === cpf)
    
    if (!usuario) {
        return res.json({ erro: 'Usuário não encontrado!' })
    }

    return res.json(usuario.extrato)
})

app.get('/saldo', (req, res) => {
    const {cpf} = req.body
    const usuario = contasUser.find(buscarConta => buscarConta.cpf === cpf)

    if(!usuario) {
        return res.json({ erro: "Usuário não encontrado!"})
    }

    return res.json(usuario.saldo)
})

app.listen(3000, () => {
    console.log("Servidor rodando!")
})