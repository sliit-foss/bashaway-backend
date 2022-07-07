import express from 'express';
import { login, register, logout, current } from '../controllers/auth';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.get('/logout', logout);
authRouter.get('/current', current);

export default authRouter;