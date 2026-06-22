import bcrypt from 'bcrypt'

export async function fraudeSenha (usuarioLogado, senhaCadastro) {
    if (!usuarioLogado) return;

    let validacaoSenha = await bcrypt.compare(senhaCadastro, usuarioLogado.senha)

    if (validacaoSenha === false) {
        usuarioLogado.tentativasSenha ++;
        if (usuarioLogado.tentativasSenha === 3) {
            usuarioLogado.bloqueado = true;
        }
    } else {
        usuarioLogado.tentativasSenha = 0;
    }
}   

export function fraudeSaque (usuarioLogado, valorSaque) {
        if (!usuarioLogado) return;

        if (valorSaque > 15000) {
            usuarioLogado.bloqueado = true;
            console.log("Tentativa suspeita detectada! seu cartão foi bloqueado. Ligue para central de atendimento.");
        } else {
            if (valorSaque > 5000) {
            usuarioLogado.tentativaFraudeSaque ++;
        }
        }
}