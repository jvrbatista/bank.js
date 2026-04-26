export function depositar (saldo, valorDepositar) {
    return saldo + valorDepositar;
}

export function sacar (saldo, valorSaque) {
    if (saldo >= valorSaque) {
        return saldo - valorSaque;
    } else {
        console.log("O saldo é insuficiente para esse valor.")
        return saldo;
    }
}
