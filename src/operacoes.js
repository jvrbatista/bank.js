export function depositar (saldo, valorDepositar) {
    return saldo + valorDepositar;
}

export function sacar (saldo, valorSaque) {
    if (saldo >= valorSaque) {
        console.log("Saque efetuado com sucesso!")
        return saldo - valorSaque;
    } else {
        console.log("Saldo insulficiente!")
        return saldo;
    }
}
