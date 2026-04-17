import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
const rl = readline.createInterface({ input, output });

let listaCadastro = [];
let usuarioCadastrado = null;


function depositar (saldoCLiente, valorDepositar) {
return saldoCLiente + valorDepositar;
};

function sacar (saldoCLiente, valorSaque) {
    if (saldoCLiente >= valorSaque) {
        return saldoCLiente - valorSaque;
    } 
    
    else {
        console.log("O saldo é insuficiente para esse valor.")
        return saldoCLiente;
    }
};

async function telaAutenticacao () {
    console.log("\nOlá cliente do BANK, Seja bem-vindo!");

    while (true ) {
    console.log("\n============ CADASTRO DO BANCO BANK ============")
    let logout = await rl.question("1-Cadastrar\n2-Login\n\nQual serviço você deseja hoje?: ")
        if (logout == "1") {
            let nomeCliente = await rl.question("Cadastre o seu nome de usuário: ");
            let senhaCliente = await rl.question("Cadastre a sua senha: ");
            listaCadastro.push({
                nome: nomeCliente,
                senha: senhaCliente,
                saldoCliente: 0,
                extrato: [],
                pontosSuspeita: 0,
                saquesSeguidos: 0,
                cartaoBloqueado: false                    
            })}

        if (logout == "2") {
            let nomeCadastro = await rl.question("Digite seu nome de usuário: ");
            let senhaCadastro = await rl.question("Digite sua senha para entrar: ")

            usuarioCadastrado = listaCadastro.find(dadoscadastrais => dadoscadastrais.nome === nomeCadastro && dadoscadastrais.senha === senhaCadastro);
                if (usuarioCadastrado) {
                    if (usuarioCadastrado.cartaoBloqueado === true) {
                        console.log("Cartão Bloqueado. Ligue para central de atendimento.")
                    } else{      
                    console.log(`Bem-vindo, ${usuarioCadastrado.nome}!`);
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
    let solicitacao = await rl.question("1-Sacar\n2-Depositar\n3-Verificar Extrato\n4-Voltar ao menu\n\nQual serviço você deseja hoje?: ")

        if (solicitacao == "1") {
            let valorSaque = Number(await rl.question("Qual valor deseja sacar? R$"));
                if (valorSaque > 1000) {
                usuarioCadastrado.pontosSuspeita += 1;
                }
            usuarioCadastrado.saldoCliente = sacar(usuarioCadastrado.saldoCliente, valorSaque);
            usuarioCadastrado.extrato.push(`Saque de R$${valorSaque} - Saldo: R$${usuarioCadastrado.saldoCliente}`);
            console.log(`Saldo atual: R$${usuarioCadastrado.saldoCliente}`);
            usuarioCadastrado.saquesSeguidos += 1;
        }

        if (solicitacao == "2") {
            let valorDepositar = Number(await rl.question("Qual valor deseja depositar? R$"));
            usuarioCadastrado.saldoCliente = depositar(usuarioCadastrado.saldoCliente, valorDepositar);
            usuarioCadastrado.extrato.push(`Depósito de R$${valorDepositar} - Saldo: R$${usuarioCadastrado.saldoCliente}`)
            console.log(`Saldo atual: R$${usuarioCadastrado.saldoCliente}`)
            usuarioCadastrado.saquesSeguidos = 0;
        } 

        if (solicitacao == "3") {
            console.log("========== EXTRATO ==========")
            for (let linha of usuarioCadastrado.extrato) {
                console.log(linha);
            }
        }

        if (solicitacao == "4") {
            console.log(`Sistema Finalizado. Até mais ${usuarioCadastrado.nome}`);
            usuarioCadastrado = null;
            await telaAutenticacao();
        } 

        if (!["1","2","3","4"].includes(solicitacao)) {
            console.log("Resposta inválida! Voltando para tela inicial.")
            await telaAutenticacao();
            continue;
        }

        if (usuarioCadastrado.saquesSeguidos > 3) {
            usuarioCadastrado.pontosSuspeita += 1
        }

        if (usuarioCadastrado.pontosSuspeita >= 2) {
            usuarioCadastrado.cartaoBloqueado = true
            console.log("Muitos saques seguidos. Seu cartão foi bloqueado.")
            await telaAutenticacao();
        }
    }

rl.close();
