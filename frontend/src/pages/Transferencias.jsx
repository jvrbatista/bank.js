import logo from '../assets/logoBankJs.png'
import { useState, useEffect } from 'react'
import api from '../services/api.js'
import { useNavigate } from 'react-router-dom'

export default function Transferencias() {
    const [cpfDestino, setCpfDestino] = useState('')
    const [valor, setValor] = useState('')
    const [cpfUsuario, setCpfUsuario] = useState('')
    const [saldo, setSaldo] = useState(0)
    const navigate = useNavigate()

    function handleSair() {
        sessionStorage.clear()
        navigate('/')
    }

    useEffect(() => {
        async function carregar() {
            const token = sessionStorage.getItem('token')
            const tokenDecodificado = JSON.parse(atob(token.split('.')[1]))
            const cpf = tokenDecodificado.cpf
            setCpfUsuario(cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'))
            
            const resposta = await api.get('/saldo', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setSaldo(resposta.data)
        }
        carregar()
    }, [])

    async function handleTransferir() {
        const token = sessionStorage.getItem('token')
        const resposta = await api.post('/transferir', 
            { cpfDestino, valorTransferencia: valor },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log(resposta.data)
        setCpfDestino('')
        setValor('')
        setSaldo(resposta.data.saldo)
    }

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
                    <a href="/dashboard" className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-xl">Dashboard</a>
                    <a href="/transferencias" className="flex items-center gap-3 text-emerald-500 bg-emerald-500/10 px-4 py-3 rounded-xl">PIX</a>
                    <a href="/extrato" className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-xl">Extrato</a>
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
            <div className="flex-1 bg-black p-8 flex flex-col">
                <h2 className="text-white text-2xl font-bold mb-6">PIX</h2>
                <div className="flex flex-col justify-center items-center flex-1">
                    <div className="w-full max-w-2xl">
                        <div className="bg-zinc-900 rounded-2xl p-6 mb-4 flex justify-between items-center">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Saldo disponível</p>
                                <p className="text-emerald-500 text-3xl font-bold">R$ {Number(saldo).toFixed(2).replace('.', ',')}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-400 text-sm mb-1">Sua chave Pix</p>
                                <p className="text-white font-bold">{cpfUsuario}</p>
                            </div>
                        </div>
                        <div className="bg-zinc-900 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6">
    <img src={logo} alt="BankJS" className="w-12 mix-blend-screen" />
    <div>
        <p className="text-white font-bold text-lg">BankJS</p>
        <p className="text-emerald-500 text-sm">Transferência via PIX</p>
    </div>
</div>
                            <input
                                value={cpfDestino}
                                onChange={(e) => setCpfDestino(e.target.value)}
                                type="text"
                                placeholder="CPF do destinatário"
                                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-emerald-500"
                            />
                            <input
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                                type="number"
                                placeholder="Valor: R$ 0,00"
                                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-emerald-500"
                            />
                            <button
                                onClick={handleTransferir}
                                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-400 font-bold text-white rounded-xl px-4 py-3 mb-4"
                            >
                                Transferir
                            </button>
                            <p className="text-gray-400 text-sm text-center">Transfira dinheiro instantaneamente usando o CPF do destinatário.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}