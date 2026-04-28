
export function fraudeSenha (usuarioLogado, senhaCadastro) {
    if (!usuarioLogado) return;

    if (senhaCadastro !== usuarioLogado.senha) {
        usuarioLogado.tentativasSenha ++;
        if (usuarioLogado.tentativasSenha === 3) {
            usuarioLogado.bloqueado = true;
        }
    } else {
        usuarioLogado.tentativasSenha = 0;
    }
}

export function fraudeSaque (usuarioLogado, valorSaque) {
        if (!usuarioLogado);

        if (valorSaque >= 5000) {
            usuarioLogado.tentativaFraudeSaque ++;
        }
        if (valorSaque > 15000) {
            usuarioLogado.bloqueado = true;
            console.log("Tentativa suspeita detectada! seu cartão foi bloqueado. Ligue para central de atendimento.");
        }
}