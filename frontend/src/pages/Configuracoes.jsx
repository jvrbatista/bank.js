import { useState} from 'react'
import api from '../services/api.js'
import { useNavigate } from 'react-router-dom'
import { pegarToken, removerToken } from '../services/storage.js'   
import  Sidebar  from '../components/Sidebar.jsx'

export default function Configuracoes() {
    const [senhaAtual, setSenhaAtual] = useState('')
    const [novaSenha, setNovaSenha] = useState('')
    const[confirmarNovaSenha, setConfirmarNovaSenha] = useState ('')
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
    const navigate = useNavigate()

    const links = [
    { href: '/dashboard', label: 'Dashboard', ativo: false },
    { href: '/transferencias', label: 'PIX', ativo: false },
    { href: '/extrato', label: 'Extrato', ativo: false },
    { href: '/configuracoes', label: 'Configurações', ativo: true },
    ]

    const token = pegarToken('usuario')

    async function handleTrocarSenha() {
        if (novaSenha !== confirmarNovaSenha) {
            setErro('As senhas não coincidem!')
            return
        } else {
            try {
                const resposta = await api.put('/trocarSenha', 
                { senhaAtual, novaSenha },
                { headers: { Authorization: `Bearer ${token}` } }
            )
                console.log(resposta.data)
                setSucesso(resposta.data.mensagem)
            } catch (error) {
                setErro(error.response?.data?.erro || 'Erro ao conectar com o servidor')
            }
        }
    }

    function handleSair() {
        const token = removerToken('usuario')
        navigate('/')
    }
    
        return (
        <div className="flex min-h-screen bg-black">
            <Sidebar links={links} onSair={handleSair} />
            <div className="flex-1 bg-black p-8 flex flex-col">
                <h2 className="text-white text-2xl font-bold mb-6">Configurações</h2>
                <div className="flex flex-col justify-center items-center flex-1">
                <div className="w-full max-w-md">
                    <h3 className="text-white text-xl font-bold mb-4">Alteração de <span className="text-emerald-500">senha</span></h3>
                    <div className="bg-zinc-900 rounded-2xl p-6">
                    <p className="text-gray-400 mb-1">Senha atual</p>
                    <input
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        type="password"
                        placeholder="Digite sua senha atual"
                        className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-gray-400 mb-1">Nova senha</p>
                    <input
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        type="password"
                        placeholder="Digite sua nova senha"
                        className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-gray-400 mb-1">Confirmar nova senha</p>
                    <input
                        value={confirmarNovaSenha}
                        onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                        type="password"
                        placeholder="Confirme sua nova senha"
                        className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-emerald-500"
                    />
                    {erro && <p className="text-red-400 text-sm mb-4">{erro}</p>}
                    {sucesso && <p className="text-emerald-500 text-sm mb-4">{sucesso}</p>}
                    <button
                        onClick={handleTrocarSenha}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-400 font-bold text-white rounded-xl px-4 py-3"
                    >
                        Trocar senha
                    </button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}