import express from 'express'
import { loginGestao, cadastroGestao, buscarContaPorCpf, buscarContas, buscarExtrato, bloquearContaPorCpf } from '../controllers/gestaoControllers.js'
import { autenticadorManager } from '../middlewares/auth.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
const router = express.Router()

router.post('/loginGestao', asyncHandler(loginGestao))
router.post('/cadastroGestao', asyncHandler(cadastroGestao))
router.get('/gerente/contas', autenticadorManager, asyncHandler(buscarContas))
router.get('/gerente/contas/:cpf', autenticadorManager, asyncHandler(buscarContaPorCpf))
router.get('/gerente/transacoes', autenticadorManager, asyncHandler(buscarExtrato))
router.put('/gerente/bloquear/:cpf', autenticadorManager, asyncHandler(bloquearContaPorCpf))

export default router