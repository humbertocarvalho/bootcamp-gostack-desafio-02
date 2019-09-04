import 'dotenv/config';
import Queue from './lib/Queue';

// Esse arquivo fica rodando em outro processo do que o servidor primário

Queue.processQueue();
