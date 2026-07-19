import express from 'express'
import { loginUsuario, cadastroUsuario, saldo, extratoUsuario, depositarUsuario, sacarUsuario, transferir, trocarSenha } from '../controllers/usuarioControllers.js'
import { autenticadorUser } from '../middlewares/auth.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
const router = express.Router()


router.post('/loginUsuario', asyncHandler(loginUsuario))
router.post('/cadastroUsuario', asyncHandler(cadastroUsuario))
router.get('/saldo', asyncHandler(autenticadorUser), asyncHandler(saldo))
router.get('/extratoUsuario', asyncHandler(autenticadorUser), asyncHandler(extratoUsuario))
router.post('/depositarUsuario', asyncHandler(depositarUsuario))
router.post('/sacarUsuario', asyncHandler(sacarUsuario))
router.post('/transferir', asyncHandler(autenticadorUser), asyncHandler(transferir))
router.put('/trocarSenha', asyncHandler(autenticadorUser), asyncHandler(trocarSenha))

export default router