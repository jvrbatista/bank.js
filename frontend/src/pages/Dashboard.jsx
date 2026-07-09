import logo from '../assets/logoBankJs.png'
import { useState, useEffect } from 'react'
import api from '../services/api.js'
import { useNavigate } from 'react-router-dom'
import { pegarToken, removerToken } from '../services/storage.js'    

export default function Dashboard() {
    const [saldo, setSaldo] = useState(0)
    const [extrato, setExtrato] = useState([])
    const navigate = useNavigate()

    function handleSair() {
        const token = removerToken('usuario')
        navigate('/')
    }
    
    useEffect(() => {
        async function buscarSaldo() {
            const token = pegarToken('usuario')
            const resposta = await api.get('/saldo', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setSaldo(resposta.data)
        }
        buscarSaldo()

        async function buscarExtrato() {
        const token = pegarToken('usuario')
        const resposta = await api.get('/extratoUsuario', {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (Array.isArray(resposta.data)) {
            setExtrato(resposta.data)
            console.log(extrato)
        }
    }
        buscarExtrato()
    }, []) 

    return (
        <div className="flex min-h-screen bg-black">
            <div className="w-64 bg-zinc-900 p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                    <img src={logo} alt="BankJS" className="w-10 mix-blend-screen" />
                    <h1 className="text-white text-2xl font-bold tracking-widest">
                        BANK<span className="text-emerald-500">JS</span>
                    </h1>
                </div>
                <nav className="flex flex-col gap-2">
                    <a href="/dashboard" className="flex items-center gap-3 text-emerald-500 bg-emerald-500/10 px-4 py-3 rounded-xl">
                        Dashboard
                    </a>
                    <a href="/transferencias" className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-xl">
                        PIX
                    </a>
                    <a href="/extrato" className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-xl">
                        Extrato
                    </a>
                </nav>
                <div className="mt-4 border-t border-zinc-700 pt-4 flex flex-col gap-2">
                    <span className="text-gray-600 px-4 py-3">Cartões</span>
                    <span className="text-gray-600 px-4 py-3">Investimentos</span>
                    <span className="text-gray-600 px-4 py-3">Empréstimos</span>
                    <span className="text-gray-600 px-4 py-3">Seguros</span>
                    <span className="text-gray-600 px-4 py-3">Configurações</span>
                </div>
                <button onClick={handleSair} className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-xl">
                    Sair
                </button>
            </div>
            <div className="flex-1 bg-black p-8">
                <h2 className="text-white text-2xl font-bold mb-6">Dashboard</h2>
                <div className="flex gap-4 mb-8">
                    <div className="bg-zinc-900 rounded-2xl p-6 w-64">
                        <p className="text-gray-400 text-sm mb-1">Saldo em conta</p>
                        <p className="text-emerald-500 text-3xl font-bold">R$ {Number(saldo).toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div className="bg-zinc-900 rounded-2xl p-6 w-64">
                        <p className="text-gray-400 text-sm mb-1">Limite disponível</p>
                        <p className="text-white text-3xl font-bold">R$ 0,00</p>
                    </div>
                    <div className="bg-zinc-900 rounded-2xl p-6 w-64">
                        <p className="text-gray-400 text-sm mb-1">Investimentos</p>
                        <p className="text-white text-3xl font-bold">R$ 0,00</p>
                    </div>
                    <div className="bg-zinc-900 rounded-2xl p-6 w-64">
                        <p className="text-gray-400 text-sm mb-1">Gastos do mês</p>
                        <p className="text-white text-3xl font-bold">R$ 0,00</p>
                    </div>
                </div>
                <h2 className="text-white text-2xl font-bold mb-6">Últimas transações</h2>
                <div className="bg-zinc-900 rounded-2xl p-6">
                    {extrato.length === 0 ? (
                        <p className="text-gray-400">Nenhuma transação encontrada.</p>
                    ) : (
                        [...extrato].reverse().slice(0, 5).map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-3 border-b border-zinc-800">
                                <div>
                                    <p className="text-white">{item.tipo}</p>
                                    <p className="text-gray-400 text-sm">{item.data}</p>
                                </div>
                                <p className={item.tipo === 'DEPÓSITO' || item.tipo === 'RECEBEU' ? "text-emerald-500" : "text-red-400"}>
                                {item.tipo === 'DEPÓSITO' || item.tipo === 'RECEBEU' ? '+' : '-'} R$ {Number(item.valor).toFixed(2).replace('.', ',')}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}