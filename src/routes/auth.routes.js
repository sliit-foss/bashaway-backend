import express from 'express';
import { login, register, logout, current } from '../controllers/auth';
import { registerSchema } from "../validations/user"
import { celebrate, Segments } from "celebrate"

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', celebrate({ [Segments.BODY]: registerSchema }), register);
authRouter.get('/logout', logout);
authRouter.get('/current', current);

export default authRouter;