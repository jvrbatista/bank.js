import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { depositar } from './src/operacoes.js';
import { sacar } from './src/operacoes.js';
import { carregarContas, salvarContas } from './src/contas.js';
import { dataHora } from './src/utils.js';
import { fraudeSenha, fraudeSaque } from './src/seguranca.js';

const rl = readline.createInterface({ input, output });

let contas = [];
let usuarioLogado = null;


contas = carregarContas()
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
                tentativasSenha: 0, 
                tentativaFraudeSaque: 0,
                pontosFraude: 0,
                saquesConsecutivos: 0,
                bloqueado: false                    
            }) 
            salvarContas(contas)
            console.log("Sua conta foi cadastrada!")
        }

        if (logout == "2") {
            let nomeCadastro = await rl.question("Digite seu nome de usuário: ");
            let senhaCadastro = await rl.question("Digite sua senha para entrar: ")

            usuarioLogado = contas.find(dadoscadastrais => dadoscadastrais.nome === nomeCadastro);
                if(!usuarioLogado) {
                    console.log("Usuário não encontrado.");
                    continue
                } else {
                    fraudeSenha(usuarioLogado, senhaCadastro);
                        if (usuarioLogado.bloqueado) {
                            console.log("Sua conta foi bloqueada. Ligue para central de atendimento.");
                            continue
                        } else if (usuarioLogado.senha === senhaCadastro) {
                            usuarioLogado.nome = nomeCadastro;
                            usuarioLogado.tentativasSenha = 0;
                            console.log(`Bem-vindo, ${usuarioLogado.nome}!`);
                            salvarContas(contas)
                            break
                        } else {
                            console.log("Senha incorreta.");
                            continue
                        }
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
                fraudeSaque(usuarioLogado, valorSaque)
                    if (usuarioLogado.tentativaFraudeSaque > 3) {
                        usuarioLogado.bloqueado = true;
                        console.log("Sua conta foi bloqueada. Ligue para central de atendimento.");
                        continue;
                    } else if (usuarioLogado.bloqueado === true) {
                        continue;
                    }
                usuarioLogado.saldo = sacar(usuarioLogado.saldo, valorSaque);
                usuarioLogado.extrato.push({
                    tipo: "Saque",
                    valor: valorSaque,
                    data: dataHora(),
                    saldo: usuarioLogado.saldo
                });
                salvarContas(contas);
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
            salvarContas(contas)
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
                                salvarContas(contas)
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
            salvarContas(contas)
        }

        if (solicitacao == "5") {
            console.log(`O seu saldo atual é R$${usuarioLogado.saldo}`);
            continue;
        }

        if (solicitacao == "6") {
            salvarContas(contas);
            console.log(`Sistema Finalizado. Até mais ${usuarioLogado.nome}`);

            await telaAutenticacao();
        } 

        if (!["1","2","3","4","5","6"].includes(solicitacao)) {
            console.log("Resposta inválida! Voltando para tela inicial.")
            continue;
        }}
rl.close();