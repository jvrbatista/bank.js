import { useState, useEffect } from 'react'
import api from '../../services/api.js'
import { useNavigate } from 'react-router-dom'
import { pegarToken, removerToken } from '../../services/storage.js'
import Sidebar from '../../components/Sidebar.jsx'

export default function DashboardGestao() {
    const [contas, setContas] = useState([])
    const links = [
        { href: '/gestao/dashboard', label: 'Dashboard', ativo: true },
        { href: '/gestao/extrato', label: 'Extrato', ativo: false },
    ]
    const [busca, setBusca] = useState('')
    const [confirmando, setConfirmando] = useState(null)
    const navigate = useNavigate()

    function handleSair() {
        const token = removerToken('gestor')
        navigate('/gestao/login')
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

    async function handleBloquear(cpf) {
        const token = pegarToken('gestor')
        await api.put(`/gerente/bloquear/${cpf}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })

        setContas((contasAtuais) => contasAtuais.map((conta) => {
            if (conta.cpf === cpf) {
                return { ...conta, bloqueado: !conta.bloqueado }
            } else {
                return conta
            }
        }))
        setConfirmando(null)
    }

    return (
        <div className="flex min-h-screen bg-black">
            {confirmando && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-80">
                        <p className="text-white mb-6">
                            Tem certeza que deseja {contas.find((conta) => conta.cpf === confirmando)?.bloqueado ? 'desbloquear' : 'bloquear'} esta conta?
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmando(null)} className="flex-1 bg-zinc-800 text-white rounded-xl px-4 py-2">
                                Cancelar
                            </button>
                            <button onClick={() => handleBloquear(confirmando)} className="flex-1 bg-red-500 text-white rounded-xl px-4 py-2">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Sidebar links={links} onSair={handleSair} />
            <div className="flex-1 bg-black p-8">
                <h2 className="text-emerald-500 text-2xl font-bold mb-6">Dashboard</h2>
                <div className="flex gap-4 mb-8">

                </div>
                <h2 className="text-white text-2xl font-bold mb-6">Contas cadastradas</h2>
                <div className="bg-zinc-900 rounded-2xl p-6">
                    <input
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar por CPF"
                        className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-2 mb-4"
                    />
                    <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-xs text-gray-400 uppercase tracking-wider">
                            <th className="pb-3 pr-4">Nome</th>
                            <th className="pb-3 pr-4">CPF</th>
                            <th className="pb-3 pr-4">Tipo</th>
                            <th className="pb-3 pr-4">Saldo</th>
                            <th className="pb-3 pr-4">Status</th>
                            <th className="pb-3">Ação</th>
                        </tr>
                        </thead>
                        <tbody>
                        {contas.filter((conta) => conta.cpf.includes(busca)).map((conta) => {
                            const status = conta.bloqueado ? 'Bloqueado' : 'Ativo'
                            const corStatus = conta.bloqueado ? 'text-red-400' : 'text-emerald-500'
                            return (<tr key={conta.cpf} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                            <td className="py-3 pr-4 text-white">{conta.nome}</td>
                            <td className="py-3 pr-4 text-gray-400">{conta.cpf}</td>
                            <td className="py-3 pr-4 text-gray-400">{conta.tipo}</td>
                            <td className="py-3 pr-4 text-white">R$ {Number(conta.saldo).toFixed(2).replace('.', ',')}</td>
                            <td className={`py-3 pr-4 font-semibold ${corStatus}`}>{status}</td>
                            <td className="py-3">
                                <button
                                    onClick={() => setConfirmando(conta.cpf)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${conta.bloqueado ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}
                                >
                                    {conta.bloqueado ? 'Desbloquear' : 'Bloquear'}
                                </button>
                            </td>
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