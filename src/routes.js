import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import RegistrationController from './app/controllers/RegistrationController';
import AvailableMeetupController from './app/controllers/AvailableMeetupController';
import OrganizedMeetupController from './app/controllers/OrganizedMeetupController';

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
routes.get('/meetup/:id', authMiddleware, MeetupController.show);
routes.post('/meetup', authMiddleware, MeetupController.store);
routes.put('/meetup/:id', authMiddleware, MeetupController.update);
routes.delete('/meetup/:id', authMiddleware, MeetupController.delete);

// Rotas de Registro no Meetup
routes.get('/registration', authMiddleware, RegistrationController.index);
routes.post(
  '/registration/:meetupId',
  authMiddleware,
  RegistrationController.store
);

routes.delete(
  '/registration/:id',
  authMiddleware,
  RegistrationController.delete
);

// Rotas de Meetup Disponíveis
routes.get('/meetups', authMiddleware, AvailableMeetupController.index);

// Rotas de Meetup que o usuário está organizando
routes.get('/organized', authMiddleware, OrganizedMeetupController.index);

// Upload de arquivo
routes.post(
  '/files',
  upload.single('file'),
  authMiddleware,
  FileController.store
);

export default routes;
