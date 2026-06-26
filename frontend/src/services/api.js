import axios from 'axios'

const api = axios.create({
    baseURL: 'https://bankjs-production.up.railway.app'
})

export default api