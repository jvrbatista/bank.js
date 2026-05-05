import fs from 'fs';

export function carregarContasGestao() {
    try {
        const texto = fs.readFileSync('accountsManager.json', 'utf-8');
    return JSON.parse(texto);
    } catch (error) {
        return []
    }
};

export function salvarContasGestao(contaGestao) {
    fs.writeFileSync('accountsManager.json', JSON.stringify(contaGestao))
}



