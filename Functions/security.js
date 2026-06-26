import bcrypt from 'bcrypt'

export async function fraudeSenha(usuarioLogado, senhaCadastro) {
    if (!usuarioLogado) return;

    const senhaCorreta = await bcrypt.compare(senhaCadastro, usuarioLogado.senha)

    if (!senhaCorreta) {
        usuarioLogado.tentativas_senha++;
        if (usuarioLogado.tentativas_senha === 3) {
            usuarioLogado.bloqueado = true;
        }
    } else {
        usuarioLogado.tentativas_senha = 0;
    }
}