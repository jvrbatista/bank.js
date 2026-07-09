import { Navigate } from 'react-router-dom'
import { pegarToken } from '../services/storage.js'  

export default function RotaPrivada({ children }) {
    const token = pegarToken('usuario')  

    if (!token) {
        return <Navigate to="/" />
    }

    return children
}