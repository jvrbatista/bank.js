import axios from 'axios'
import { removerToken } from './storage.js'

const api = axios.create({
    baseURL: 'https://bankjs-production.up.railway.app'
})
    api.interceptors.response.use(
    (resposta) => resposta,
    (error) => {
        if (
    (error.response?.status === 401 || error.response?.status === 403) &&
    error.config.headers.Authorization
    ) {
        removerToken('usuario')
        removerToken('gestor')
        window.location.href = '/'
    }
        return Promise.reject(error)
    }
)

export default api