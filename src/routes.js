import { Router } from 'express';

const routes = Router();

// Rotas do Usuário
routes.get('/user/:id', (req, res) => {});
routes.post('/user', (req, res) => {});
routes.put('/user', (req, res) => {});
routes.delete('/user', (req, res) => {});

// Rotas de Autenticação
routes.post('/session', (req, res) => {});

export default routes;
