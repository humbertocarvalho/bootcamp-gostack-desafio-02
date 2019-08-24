import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = Router();

// Rotas do Usuário);
routes.post('/user', UserController.store);
routes.put('/user', UserController.update);
// routes.delete('/user', UserController.delete);

// Rotas de Autenticação
routes.post('/session', SessionController.store);

export default routes;
