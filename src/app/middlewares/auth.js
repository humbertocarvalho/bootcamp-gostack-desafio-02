import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não foi enviado' });
  }

  // O token vem com Bearer <TOKEN>
  // pegamos só a parte do token mesmo
  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // Injeta o id do usuário que está fazendo a requisição
    // para ser usado nas demais requisições.
    req.userId = decoded.id;
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  return next();
};
