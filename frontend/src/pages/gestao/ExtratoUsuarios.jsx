import { useState, useEffect } from 'react'
import api from '../../services/api.js'
import { useNavigate } from 'react-router-dom'
import { pegarToken, removerToken } from '../../services/storage.js'
import Sidebar from '../../components/Sidebar.jsx'

export default function ExtratoUsuario() {
    const [transacoes, setTransacoes] = useState([])
    const links = [
        { href: '/gestao/dashboard', label: 'Dashboard', ativo: false },
        { href: '/gestao/extrato', label: 'Extrato', ativo: true },
    ]
    const navigate = useNavigate()


    function handleSair() {
        const token = removerToken('gestor')
        navigate('/')
    }
    
    useEffect(() => {
        async function buscarTransacoes() {
            const token = pegarToken('gestor')
            const resposta = await api.get('/gerente/transacoes', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTransacoes(resposta.data)
        }
        buscarTransacoes()

    }, []) 

        return (
        <div className="flex min-h-screen bg-black">
            <Sidebar links={links} onSair={handleSair} />
            <div className="flex-1 bg-black p-8">
                <h2 className="text-white text-2xl font-bold mb-6">Extrato geral</h2>
                <div className="bg-zinc-900 rounded-2xl p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs text-gray-400 uppercase tracking-wider">
                                    <th className="pb-3 pr-4">Usuário</th>
                                    <th className="pb-3 pr-4">Tipo</th>
                                    <th className="pb-3 pr-4">Valor</th>
                                    <th className="pb-3 pr-4">Data</th>
                                    <th className="pb-3 pr-4">Saldo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transacoes.map((transacao) => (
                                    <tr key={transacao.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                        <td className="py-3 pr-4 text-gray-400">{transacao.user_id}</td>
                                        <td className="py-3 pr-4 text-white">{transacao.tipo}</td>
                                        <td className="py-3 pr-4 text-white">R$ {Number(transacao.valor).toFixed(2).replace('.', ',')}</td>
                                        <td className="py-3 pr-4 text-gray-400">{transacao.data}</td>
                                        <td className="py-3 pr-4 text-white">R$ {Number(transacao.saldo).toFixed(2).replace('.', ',')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}