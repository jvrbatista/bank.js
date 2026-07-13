import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Dashboard from './pages/Dashboard'
import Extrato from './pages/Extrato'
import Transferencias from './pages/Transferencias'
import RotaPrivada from './components/RotaPrivada'
import LoginGestao from './pages/gestao/LoginGestao'
import DashboardGestao from './pages/gestao/DashboardGestao'
import ExtratoUsuario from './pages/gestao/ExtratoUsuarios'


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/dashboard" element={<RotaPrivada><Dashboard /></RotaPrivada>} />
                <Route path="/extrato" element={<RotaPrivada><Extrato /></RotaPrivada>} />
                <Route path="/transferencias" element={<RotaPrivada><Transferencias /></RotaPrivada>} />
                <Route path="/gestao/login" element={<LoginGestao />} />
                <Route path="/gestao/dashboard" element={<RotaPrivada  tipo = "gestor"><DashboardGestao /></RotaPrivada>} />
                <Route path="/gestao/extrato" element={<RotaPrivada  tipo = "gestor"><ExtratoUsuario /></RotaPrivada>} />
            </Routes>
        </BrowserRouter>
    )
}