import express from 'express'
import dotenv from 'dotenv'
import './db.js'
import cors from 'cors'
import usuarioRoutes from './routes/usuarioRoutes.js'
import gestaoRoutes from './routes/gestaoRoutes.js'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(usuarioRoutes)
app.use(gestaoRoutes)


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})