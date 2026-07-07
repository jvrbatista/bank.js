import logo from '../assets/logoBankJs.png'
import {useState, useEffect} from 'react'
import api from '../services/api.js'
import ParticlesBackground from '../components/Particles.jsx'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [cpf, setCpf] = useState('')
    const [senha, setSenha] = useState('')
    const navigate = useNavigate()
    const [erro, setErro] = useState('')

    async function handleLogin() {
        try {
        const resposta = await api.post('/loginUsuario', { cpf, senha })
        console.log(resposta.data)
        sessionStorage.setItem('token', resposta.data.token)
        setCpf('')
        setSenha('')
        navigate('/dashboard')
    } catch (error) {
        setErro(error.response.data.erro)
    }}

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if (token) {
            navigate('/dashboard')
        }
    }, [])

    return (
        <div className="relative min-h-screen bg-black flex flex-col items-center justify-center">
            <ParticlesBackground />

            {erro && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 border border-red-500 rounded-2xl p-6 w-80">
                        <p className="text-white">{erro}</p>
                        <button onClick={() => setErro('')} className="mt-4 bg-red-500 text-white rounded-xl px-4 py-2 w-full">
                            Fechar
                        </button>
                    </div>
                </div>
            )}
            
            <div className="relative z-10 flex flex-col items-center bg-emerald-950/30 backdrop-blur-sm rounded-3xl px-12 py-8 border border-emerald-900/30">
                <img src={logo} alt="BankJS" className="w-115 -mb-20 mix-blend-screen" />
                <h1 className="text-white text-8xl font-bold tracking-widest">BANK<span className="text-emerald-500">JS</span></h1>
                <p className="text-gray-400 text-lg tracking-widest mb-2">BANCO DIGITAL</p>
                <div className="w-96">
                    <p className="text-gray-400 mt-8 mb-1">Bem-vindo de volta!</p>
                    <h2 className="text-white text-4xl font-bold mb-6">Acesse <span className="text-emerald-500">sua conta</span></h2>
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
                        placeholder="Digite sua senha"
                        className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                        onClick={handleLogin}
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-400 font-bold tracking-widest text-white rounded-xl px-4 py-3 mb-4"
                    >
                        Entrar
                    </button>
                </div>
                <p className ="text-gray-400 text-center text-sm mt-2">
                    Não tem conta? <a href="/cadastro" className="text-emerald-500 houver:underline">Criar conta</a>
                </p>
            </div>
        </div>
    )
}