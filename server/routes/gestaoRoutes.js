import express from 'express'
import { loginGestao, cadastroGestao, buscarContaPorCpf, buscarContas, buscarExtrato, bloquearContaPorCpf } from '../controllers/gestaoControllers.js'
import { autenticadorManager } from '../middlewares/auth.js'
const router = express.Router()

router.post('/loginGestao', loginGestao)
router.post('/cadastroGestao', cadastroGestao)
router.get('/gerente/contas', autenticadorManager, buscarContas)
router.get('/gerente/contas/:cpf', autenticadorManager, buscarContaPorCpf)
router.get('/gerente/transacoes', autenticadorManager, buscarExtrato)
router.put('/gerente/bloquear/:cpf', autenticadorManager, bloquearContaPorCpf)

export default router