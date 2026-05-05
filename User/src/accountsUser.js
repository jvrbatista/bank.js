import fs from 'fs';
 
export function carregarContas() {
    try {
        const texto = fs.readFileSync('accountUser.json', 'utf-8');
    return JSON.parse(texto);
    } catch (error) {
        return []
    }
};

export function salvarContas(contas) {
    fs.writeFileSync('accountUser.json', JSON.stringify(contas))
}