const CHAVES = {
    usuario: 'tokenUsuario',   
    gestor: 'tokenGestao'     
}

export function salvarToken(tipo, token) {
    const chave = CHAVES[tipo]
    sessionStorage.setItem(chave, token)   
}

export function pegarToken(tipo) {
    const chave = CHAVES[tipo]
    return sessionStorage.getItem(chave)   
}

export function removerToken(tipo) {
    const chave = CHAVES[tipo]
    sessionStorage.removeItem(chave)   
}