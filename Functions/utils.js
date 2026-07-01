export function dataHora() {
    const agora = new Date()
    return agora.toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'})
}