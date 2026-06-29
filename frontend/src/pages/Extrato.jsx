import logo from '../assets/logoBankJs.png'
import { useState, useEffect } from 'react'
import api from '../services/api.js'

export default function Extrato() {
    const [extrato, setExtrato] = useState([])
    
    useEffect(() => {
        async function buscarExtrato() {
            const token = sessionStorage.getItem('token')
            const resposta = await api.get('/extratoUsuario', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (Array.isArray(resposta.data)) {
                setExtrato(resposta.data)
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
                    <a href="/dashboard" className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-xl">
                        Dashboard
                    </a>
                    <a href="/transferencias" className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-xl">
                        PIX
                    </a>
                    <a href="/extrato" className="flex items-center gap-3 text-emerald-500 bg-emerald-500/10 px-4 py-3 rounded-xl">
                        Extrato
                    </a>
                </nav>
                <div className="mt-4 border-t border-zinc-700 pt-4 flex flex-col gap-2">
                    <span className="text-gray-600 px-4 py-3">Cartões</span>
                    <span className="text-gray-600 px-4 py-3">Investimentos</span>
                    <span className="text-gray-600 px-4 py-3">Empréstimos</span>
                    <span className="text-gray-600 px-4 py-3">Seguros</span>
                    <span className="text-gray-600 px-4 py-3">Configurações</span>
                    <span className="text-gray-600 px-4 py-3">Sair</span>
                </div>
            </div>
            <div className="flex-1 bg-black p-8">
                <h2 className="text-white text-2xl font-bold mb-6">Extrato</h2>
                <div className="bg-zinc-900 rounded-2xl p-6">
                    {extrato.length === 0 ? (
                        <p className="text-gray-400">Nenhuma transação encontrada.</p>
                    ) : (
                        extrato.map((item, index) => (
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