import { Navigate } from 'react-router-dom'
import { pegarToken } from '../services/storage.js'  

export default function RotaPrivada({ children, tipo = 'usuario' }) {
    const token = pegarToken(tipo) 
    
    const destino = tipo === 'gestor' ? '/gestao/login' : '/'

    if (!token) {
        return <Navigate to={destino} />
    }

    return children
}