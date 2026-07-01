import express from 'express'
import { loginUsuario, cadastroUsuario, saldo, extratoUsuario, depositarUsuario, sacarUsuario, transferir } from '../controllers/usuarioControllers.js'
import { autenticadorUser } from '../middlewares/auth.js'
const router = express.Router()

router.post('/loginUsuario', loginUsuario)
router.post('/cadastroUsuario', cadastroUsuario)
router.get('/saldo', autenticadorUser, saldo)
router.get('/extratoUsuario', autenticadorUser, extratoUsuario)
router.post('/depositarUsuario', depositarUsuario)
router.post('/sacarUsuario', sacarUsuario)
router.post('/transferir', autenticadorUser, transferir)

export default router