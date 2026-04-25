import fs from 'fs'
import express from 'express'

let contas = [];

function depositar (saldo, valorDepositar) {
    return saldo + valorDepositar;
};

function sacar (saldo, valorSaque) {
    if (saldo >= valorSaque) {
        return saldo - valorSaque;
    } 
    
    else {
        console.log("O saldo é insuficiente para esse valor.")
        return saldo;
    }
};

function dataHora() {
    const agora = new Date()
    return `${agora.toLocaleDateString('pt-BR')} às ${agora.toLocaleTimeString('pt-BR')}`
}
 
function carregarContas() {
    try {
        const texto = fs.readFileSync('contas.json', 'utf-8');
    return JSON.parse(texto);
    } catch (error) {
        return []
    }
};

function salvarConta() {
    fs.writeFileSync('contas.json', JSON.stringify(contas))
}

contas = carregarContas()
const app = express()
app.use(express.json())

app.post('/cadastrar', (req, res) => {
    const {tipo, cpf, nome, senha} = req.body

        const cpfduplicado = contas.find(usuario => usuario.cpf === cpf)
            if (cpfduplicado){
                return res.json ({ erro: "CPF já cadastrado!"})
            }

            contas.push({
                tipo: tipo,
                cpf: cpf,
                nome: nome,
                senha: senha,
                saldo: 0,
                extrato: [],
                pontosFraude: 0,
                saquesConsecutivos: 0,
                bloqueado: false                    
            }) 

            salvarConta()  

    res.json({ mensagem: `Usuário cadastrado com sucesso!`})

})

app.post('/login', (req, res) => {
    const {nome, senha} = req.body

    const usuario = contas.find(u => u.nome === nome && u.senha === senha)

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

app.post('/depositar', (req, res) => {
    const {cpf, valorDepositar} = req.body
    const usuario = contas.find(buscaConta => buscaConta.cpf === cpf)

    if (!usuario) {
        return res.json({ erro: 'Usuário não encontrado!' })
    }

    if (valorDepositar <= 0) {
       return res.json({ erro: "Valor inválido!"})
    }

    usuario.saldo = depositar(valorDepositar, usuario.saldo)
    usuario.extrato.push({
        tipo: "Depósito",
        valor: valorDepositar,
        data: dataHora(),
        saldo: usuario.saldo
    })
    
    salvarConta()

    return res.json({
        saldo: usuario.saldo
    })
    
})

app.post('/sacar', (req, res) => {
    const {cpf, valorSaque} = req.body
    const usuario = contas.find(u => u.cpf === cpf)

    if (!usuario) {
        return res.json({ erro: 'Usuário não encontrado!' })
    }
    if (valorSaque <= 0) {
        return res.json({ erro: "Valor inválido!"})
    }

    if (valorSaque > 1000) {
        return res.json({ erro: "Valor inválido!"})
    }

    usuario.saldo = sacar(valorSaque, usuario.saldo)
    usuario.extrato.push({
        tipo: "Saque",
        valor: valorSaque,
        data: dataHora(),
        saldo: usuario.saldo
    });
    
    salvarConta()

    return res.json({
        saldo: usuario.saldo
    })

    
})

app.post('/transferir', (req, res) => {
    const {cpf, cpfDestino, valorTransferencia} = req.body
    const usuario = contas.find(buscaConta => buscaConta.cpf === cpf)
    const contaDestino = contas.find(buscaContaDestino => buscaContaDestino.cpf === cpfDestino)

    if (!usuario) {
        return res.json({ erro: 'Usuário não encontrado!' })
    }
    if (!contaDestino) {
        return res.json({ erro: 'Conta destino não encontrada!' })
    }
    if (valorTransferencia <= 0) {
        return res.json({ erro: "Valor inválido!"})
    }
    if (usuario.saldo <= valorTransferencia) {
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
        salvarConta()
        return res.json({
        saldo: usuario.saldo
        })
    }       
})

app.get('/extrato', (req, res) => {
    const {cpf} = req.body
    const usuario = contas.find(buscaConta => buscaConta.cpf === cpf)
    
    if (!usuario) {
        return res.json({ erro: 'Usuário não encontrado!' })
    }

    return res.json(usuario.extrato)
})

app.get('/saldo', (req, res) => {
    const {cpf} = req.body
    const usuario = contas.find(buscarConta => buscarConta.cpf === cpf)

    if(!usuario) {
        return res.json({ erro: "Usuário não encontrado!"})
    }

    return res.json(usuario.saldo)
})

app.listen(3000, () => {
    console.log("Servidor rodando!")
})