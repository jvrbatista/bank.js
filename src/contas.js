import fs from 'fs';
let contas = [];
 
export function carregarContas() {
    try {
        const texto = fs.readFileSync('contas.json', 'utf-8');
    return JSON.parse(texto);
    } catch (error) {
        return []
    }
};

export function salvarContas(contas) {
    fs.writeFileSync('contas.json', JSON.stringify(contas))
}