import { carregarContas } from "./contas.js"
carregarContas()
export function fraudeSenha (usuarioLogado, senhaCadastro) {
    if (!usuarioLogado) return;

    if (senhaCadastro !== usuarioLogado.senha) {
        usuarioLogado.tentativasSenha += 1;
        if (usuarioLogado.tentativasSenha === 3) {
            usuarioLogado.bloqueado = true;
        }
    } else {
        usuarioLogado.tentativasSenha = 0;
    }
}

//export function fraudeSaque () {
//    let fraudeSaque = 0;
//        if (valorSaque >= 5000) {
//            fraudeSaque = fraudeSaque + 1;
//        }
//        if (valorSaque >= 10000 ) {
//            usuarioLogado.bloqueado = true;
//            console.log("Compra suspeita detectada! seu cartão foi bloqueado. Ligue para central de atendimento.");
//        }
//}