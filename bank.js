import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
const rl = readline.createInterface({ input, output });

//variaveis
let saldoCliente = 2500;
let extrato = [];
let pontosSuspeita = 0;
let cartaoBloqueado = false;
let saquesSeguidos = 0;

//função para cliente depositar dinheiro na conta
function depositar (saldoCLiente, valorDepositar) {
   return saldoCLiente + valorDepositar;
};
//função para cliente sacar dinheiro da conta
function sacar (saldoCLiente, valorSaque) {
    if (saldoCLiente > valorSaque) {
        return saldoCLiente - valorSaque;
    }

    else {
        console.log("O saldo é insuficiente para esse valor.")
        return saldoCLiente;
    }
};

//interface para usuário
    console.log(`Olá cliente do BANK, Seja bem-vindo!`);

while (true)   {
    //Se cartão estiver bloqueado, o sistema bancário não funciona
    if (cartaoBloqueado === true) {
        console.log("Cartão Bloqueado. Ligue para central de atendimento.")
        break
    }
    console.log("========== MENU ==========");
    let solicitacao = await rl.question("1-Sacar\n2-Depositar\n3-Verificar Extrato\n4-Sair\n\nQual serviço você deseja hoje?: ")

        if (solicitacao == "1") {
            let valorSaque = Number(await rl.question("Qual valor deseja sacar? R$"));
                if (valorSaque > 1000) {
                pontosSuspeita += 1;
                }
            saldoCliente = sacar(saldoCliente, valorSaque);
            extrato.push(`Saque de R$${valorSaque} - Saldo: R$${saldoCliente}`);
            console.log(`Saldo atual: R$${saldoCliente}`);
            saquesSeguidos += 1;
        }

        if (solicitacao == "2") {
            let valorDepositar = Number(await rl.question("Qual valor deseja depositar? R$"));
            saldoCliente = depositar(saldoCliente, valorDepositar);
            extrato.push(`Depósito de R$${valorDepositar} - Saldo: R$${saldoCliente}`)
            console.log(`Saldo atual: R$${saldoCliente}`)
        } 

        if (solicitacao == "3") {
            console.log("=== EXTRATO ===")
            for (let linha of extrato) {
                console.log(linha);
            }
        }

        if (solicitacao == "4") {
            console.log("Sistema finalizado.")
         break
        } 

        if (!["1","2","3","4"].includes(solicitacao)) {
            console.log("Resposta inválida! Sistema finalizado.")
            break
        }

        if (saquesSeguidos >= 3) {
            pontosSuspeita += 1
        }

        if (pontosSuspeita >= 2) {
            cartaoBloqueado = true
            console.log("Muitos saques seguidos. Seu cartão foi bloqueado.")
        }
    }

rl.close();

