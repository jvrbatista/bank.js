import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Extrato from './pages/Extrato'
import Transferencias from './pages/Transferencias'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/extrato" element={<Extrato />} />
                <Route path="/transferencias" element={<Transferencias />} />
            </Routes>
        </BrowserRouter>
    )
}