import logo from '../assets/logoBankJs.png'
import {useState} from 'react'
import api from '../services/api.js'
import ParticlesBackground from '../components/Particles.jsx'
import { useNavigate } from 'react-router-dom'

export default function Cadastro() {
    const [tipo, setTipo] = useState('')
    const [nome, setNome] = useState('')
    const [cpf, setCpf] = useState('')
    const [senha, setSenha] = useState('')
    const navigate = useNavigate()

    async function handleCadastro() {
        const resposta = await api.post('/cadastroUsuario', {tipo, cpf, nome, senha})
        console.log(resposta.data)
        setTipo('')
        setNome('')
        setCpf('')
        setSenha('')
        navigate('/')
    }

    return (
        <div className="relative min-h-screen bg-black flex flex-col items-center justify-center">
            <ParticlesBackground />
            <div className="relative z-10 flex flex-col items-center bg-emerald-950/30 backdrop-blur-sm rounded-3xl px-12 py-8 border border-emerald-900/30">
                <img src={logo} alt="BankJS" className="w-115 -mb-20 mix-blend-screen" />
                <h1 className="text-white text-8xl font-bold tracking-widest">BANK<span className="text-emerald-500">JS</span></h1>
                <p className="text-gray-400 text-lg tracking-widest mb-2">BANCO DIGITAL</p>
                <div className="w-96">
                    <p className="text-gray-400 mt-8 mb-1">Crie sua conta</p>
                    <h2 className="text-white text-4xl font-bold mb-6">Vamos <span className="text-emerald-500">começar</span></h2>
                    <p className="text-gray-400 mt-8 mb-1">Tipo de conta</p>
                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-emerald-500"
                    >
                        <option value="">Selecione o tipo de conta</option>
                        <option value="Corrente">Corrente</option>
                        <option value="Poupança">Poupança</option>
                    </select>
                    <p className="text-gray-400 mt-8 mb-1">Nome completo</p>
                    <input 
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        type="text"
                        placeholder="Digite seu nome completo"
                        className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-gray-400 mt-8 mb-1">CPF</p>
                    <input 
                        maxLength={11}
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        type="text"
                        placeholder="Digite seu CPF"
                        className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-gray-400 mt-8 mb-1">Senha</p>
                    <input 
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        type="password"
                        placeholder="Crie sua senha"
                        className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-emerald-500"
                    />
                    <div className="flex items-start gap-2 mb-4">
                        <span className="text-emerald-500 text-sm mt-0.5">🛡</span>
                        <div>
                            <p className="text-gray-400 text-sm mb-1">A senha deve conter pelo menos:</p>
                            <div className="flex gap-4">
                                <span className="text-emerald-500 text-sm">●</span> <p className="text-gray-400 text-sm mb-1"> 8 caracteres</p>
                                <span className="text-emerald-500 text-sm">●</span> <p className="text-gray-400 text-sm mb-1"> 1 número</p>
                                <span className="text-emerald-500 text-sm">●</span> <p className="text-gray-400 text-sm mb-1"> 1 letra maiúscula</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleCadastro}
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-400 font-bold tracking-widest text-white rounded-xl px-4 py-3 mb-4"
                    >
                        Criar conta
                    </button>
                </div>
                <p className ="text-gray-400 text-center text-sm mt-2">
                    Já tem uma conta? <a href="/" className="text-emerald-500 houver:underline">Entrar</a>
                </p>
            </div>
        </div>
    )
}