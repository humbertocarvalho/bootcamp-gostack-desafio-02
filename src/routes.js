import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = Router();

// Rotas do Usuário);
routes.post('/user', UserController.store);
routes.put('/user', authMiddleware, UserController.update);
// routes.delete('/user',authMiddleware, UserController.delete);

// Rotas de Autenticação
routes.post('/session', SessionController.store);

export default routes;
