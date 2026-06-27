import logo from '../assets/logoBankJs.png'
import {useState} from 'react'
import api from '../services/api.js'
import ParticlesBackground from '../components/Particles.jsx'

export default function Login() {
    const [cpf, setCpf] = useState('')
    const [senha, setSenha] = useState('')

    async function handleLogin() {
        const resposta = await api.post('/loginUsuario', { cpf, senha })
        console.log(resposta.data)
        sessionStorage.setItem('token', resposta.data.token)
        setCpf('')
        setSenha('')
    }

    return (
        <div className="relative min-h-screen bg-black flex flex-col items-center justify-center">
            <ParticlesBackground />
            <div className="relative z-10 flex flex-col items-center">
                <img src={logo} alt="BankJS" className="w-115 -mb-20" />
                <h1 className="text-white text-8xl font-bold tracking-widest">BANK<span className="text-emerald-500">JS</span></h1>
                <p className="text-gray-400 text-lg tracking-widest mb-2">BANCO DIGITAL</p>
                <div className="w-96">
                    <p className="text-gray-400 mt-8 mb-1">Bem-vindo de volta!</p>
                    <h2 className="text-white text-4xl font-bold mb-6">Acesse <span className="text-emerald-500">sua conta</span></h2>
                    <input 
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        type="text"
                        placeholder="CPF"
                        className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-emerald-500"
                    />
                    <input 
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        type="password"
                        placeholder="Senha"
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
            </div>
        </div>
    )
}