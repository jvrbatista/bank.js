import fs from 'fs';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
const rl = readline.createInterface({ input, output });


let contas = [];
let usuarioLogado = null;

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

function dataHora() {
    const agora = new Date()
    return `${agora.toLocaleDateString('pt-BR')} às ${agora.toLocaleTimeString('pt-BR')}`
}


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
carregarContas()
async function telaAutenticacao () {
    console.log("\nOlá cliente do BANK, Seja bem-vindo!");

    while (true ) {
    console.log("\n============ CADASTRO DO BANCO BANK ============")
    let logout = await rl.question("1-Cadastrar\n2-Login\n\nQual serviço você deseja hoje?: ")
        if (logout == "1") {
            let tipo;
                let escolhaConta = await rl.question("\n========== TIPO DE CONTA ==========\n1-Corrente\n2-Poupança\n\nQual tipo de conta você vai criar? ");  
                    if (escolhaConta == "1") {
                        tipo = "Corrente";
                    }
                    if (escolhaConta == "2") {
                        tipo = "Poupança";
                    }
                    if (!["1","2"].includes(escolhaConta)) {
                        console.log("Não foi possível realizar o seu cadastro. Opção invállida!");
                        continue
                    }  
            let cpf = await rl.question("Digite seu CPF: ");
                const cpfduplicado = contas.find(usuario => usuario.cpf === cpf)
                    if (cpfduplicado){
                        console.log("Não foi possível realizar o seu cadastro. CPF já cadastrado!");
                        continue
                    }
            let nome = await rl.question("Cadastre o seu nome de usuário: ");
                    if(!isNaN(nome)) { 
                        console.log("Nome inválido! O campo acima aceita somente caracteres.")
                        continue
                    }
            let senha = await rl.question("Cadastre a sua senha: ");

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
            console.log("Sua conta foi cadastrada!")
        }

        if (logout == "2") {
            let nomeCadastro = await rl.question("Digite seu nome de usuário: ");
            let senhaCadastro = await rl.question("Digite sua senha para entrar: ")

            usuarioLogado = contas.find(dadoscadastrais => dadoscadastrais.nome === nomeCadastro && dadoscadastrais.senha === senhaCadastro);
                if (usuarioLogado) {
                    if (usuarioLogado.bloqueado === true) {
                        console.log("Cartão Bloqueado. Ligue para central de atendimento.")
                    } else{      
                    console.log(`Bem-vindo, ${usuarioLogado.nome}!`);
                    break
                    }
                } else {
                    console.log("Usuário ou senha incorretos.")
                }
        }

        if(!["1","2"].includes(logout)) {
            console.log("Resposta inválida! Escolha uma das opções acima.");
        }
    }
}  
    await telaAutenticacao();
    while (true)   {
    console.log("\n========== MENU ==========");
    let solicitacao = await rl.question("1-Sacar\n2-Depositar\n3-Tranferência\n4-Verificar Extrato\n5-Consultar saldo\n6-Voltar ao menu\n\nQual serviço você deseja hoje?: ")

        if (solicitacao == "1") {
            let valorSaque = Number(await rl.question("Qual valor deseja sacar? R$"));
                if (valorSaque > 1000) {
                usuarioLogado.pontosFraude += 1;
                }

                if (valorSaque <= 0) {
                console.log("Valor inválido para saque!");
                continue;
                }
            usuarioLogado.saldo = sacar(usuarioLogado.saldo, valorSaque);
            usuarioLogado.extrato.push({
                tipo: "Saque",
                valor: valorSaque,
                data: dataHora(),
                saldo: usuarioLogado.saldo
            });
            usuarioLogado.saquesConsecutivos += 1;
            salvarConta()
        }

        if (solicitacao == "2") {
            let valorDepositar = Number(await rl.question("Qual valor deseja depositar? R$"));
                if (valorDepositar <= 0) {
                    console.log("Valor inválido para depósito!");
                    continue;
                }
            usuarioLogado.saldo = depositar(usuarioLogado.saldo, valorDepositar);
            usuarioLogado.extrato.push({
                tipo: "Depósito",
                valor: valorDepositar,
                data: dataHora(),
                saldo: usuarioLogado.saldo
            })
            usuarioLogado.saquesConsecutivos = 0;
            salvarConta()
        } 
    
        if (solicitacao == "3") {          
            let cpfDigitado = await rl.question("Digite o CPF do recebedor: ")
            let contaDestino = contas.find(buscaConta => buscaConta.cpf == cpfDigitado)
                if (contaDestino) {
                    let valorTransferencia = Number(await rl.question("Insira o valor da transferência: "));
                        if (usuarioLogado.saldo >= valorTransferencia) {
                            console.log("Saldo suficiente!");
                            usuarioLogado.saldo -= valorTransferencia
                                usuarioLogado.extrato.push({
                                    tipo: "Realizou transferência",
                                    valor: valorTransferencia,
                                    data: dataHora(),
                                    saldo: usuarioLogado.saldo
                                });
                            contaDestino.saldo += valorTransferencia
                                contaDestino.extrato.push({
                                    tipo: "Recebeu tranferência",
                                    valor: valorTransferencia,
                                    data: dataHora(),
                                    saldo: contaDestino.saldo
                                });
                                salvarConta()
                        } else {
                            console.log("Saldo insulficiente para transferência!")
                        }
                } else {
                    console.log("CPF inválido. Conta não consta em cadastro!");
                }
        }

        if (solicitacao == "4") {
            console.log("========== EXTRATO ==========")
            for (let transacao of usuarioLogado.extrato) {
                console.log(`${transacao.tipo} de R$${transacao.valor} - Data e hora da transação: (${transacao.data}) - Saldo atual: R$${transacao.saldo}`);
            }
            salvarConta()
        }

        if (solicitacao == "5") {
            console.log(`O seu saldo atual é R$${usuarioLogado.saldo}`);
            continue;
        }

        if (solicitacao == "6") {
            salvarConta();
            console.log(`Sistema Finalizado. Até mais ${usuarioLogado.nome}`);

            await telaAutenticacao();
        } 

        if (!["1","2","3","4","5","6"].includes(solicitacao)) {
            console.log("Resposta inválida! Voltando para tela inicial.")
            await telaAutenticacao();
            continue;
        }

        if (usuarioLogado.saquesConsecutivos > 3) {
            usuarioLogado.pontosFraude += 1
        }

        if (usuarioLogado.pontosFraude >= 2) {
            usuarioLogado.bloqueado = true
            console.log("Muitos saques seguidos. Seu cartão foi bloqueado.")
            await telaAutenticacao();
        }
    }

rl.close();