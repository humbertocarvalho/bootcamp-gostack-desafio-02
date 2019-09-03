import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';

const routes = Router();
const upload = multer(multerConfig);

// TODO Adicionar tratativas do Yup em um middleware

// Rotas do Usuário);
routes.post('/user', UserController.store);
routes.put('/user', authMiddleware, UserController.update);
// routes.delete('/user',authMiddleware, UserController.delete);

// Rotas de Autenticação
routes.post('/session', SessionController.store);

// Rotas de Meetup
routes.get('/meetup', authMiddleware, MeetupController.index);
routes.post('/meetup', authMiddleware, MeetupController.store);
routes.put('/meetup/:id', authMiddleware, MeetupController.update);
routes.delete('/meetup/:id', authMiddleware, MeetupController.delete);

// Upload de arquivo
routes.post(
  '/files',
  upload.single('file'),
  authMiddleware,
  FileController.store
);

export default routes;
