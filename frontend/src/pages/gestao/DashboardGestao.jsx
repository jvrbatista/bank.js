import logo from '../../assets/logoBankJs.png'
import { useState, useEffect } from 'react'
import api from '../../services/api.js'
import { useNavigate } from 'react-router-dom'
import { pegarToken, removerToken } from '../../services/storage.js'

export default function DashboardGestao() {
    const [contas, setContas] = useState([])
    const navigate = useNavigate()

    function handleSair() {
        const token = removerToken('gestor')
        navigate('/')
    }
    
    useEffect(() => {
        async function buscarContas() {
            const token = pegarToken('gestor')
            const resposta = await api.get('/gerente/contas', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setContas(resposta.data)
        }
        buscarContas()

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
                    <a href="/gestao/dashboard" className="flex items-center gap-3 text-emerald-500 bg-emerald-500/10 px-4 py-3 rounded-xl">
                        Dashboard
                    </a>
                </nav>
                <div className="mt-4 border-t border-zinc-700 pt-4 flex flex-col gap-2">
                    <span className="text-gray-600 px-4 py-3"></span>

                </div>
                <button onClick={handleSair} className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-xl">
                    Sair
                </button>
            </div>
            <div className="flex-1 bg-black p-8">
                <h2 className="text-white text-2xl font-bold mb-6">Dashboard</h2>
                <div className="flex gap-4 mb-8">

                </div>
                <h2 className="text-white text-2xl font-bold mb-6">Contas cadastradas</h2>
                <div className="bg-zinc-900 rounded-2xl p-6">
                    <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-xs text-gray-400 uppercase tracking-wider">
                            <th className="pb-3">Nome</th>
                            <th className="pb-3">CPF</th>
                            <th className="pb-3">Tipo</th>
                            <th className="pb-3">Saldo</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Ação</th>
                        </tr>
                        </thead>
                        <tbody>
            
                        {contas.map((conta) => {
                            const status = conta.bloqueado ? 'Usuário bloqueado!' : 'Usuário desbloqueado!'
                            return (<tr key={conta.cpf} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                            <td>{conta.nome}</td>
                            <td>{conta.cpf}</td>
                            <td>{conta.tipo}</td>
                            <td>{conta.saldo}</td>
                            <td>{status}</td>
                            <td>{}</td>
                            </tr>
                        )})}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
    )
}