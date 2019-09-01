import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';

const routes = Router();
const upload = multer(multerConfig);

// Rotas do Usuário);
routes.post('/user', UserController.store);
routes.put('/user', authMiddleware, UserController.update);
// routes.delete('/user',authMiddleware, UserController.delete);

// Rotas de Autenticação
routes.post('/session', SessionController.store);

// Upload de arquivo
routes.post(
  '/files',
  upload.single('file'),
  authMiddleware,
  FileController.store
);

export default routes;
