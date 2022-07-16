import express from 'express';
import { login, register, logout, current } from '../controllers/auth';
import { registerSchema, loginSchema, verifySchema } from "../validations/user"
import { celebrate, Segments } from "celebrate"
import { verifyUser } from "../controllers/auth"

const authRouter = express.Router();

authRouter.post('/login', celebrate({ [Segments.BODY]: loginSchema }), login);
authRouter.post('/register', celebrate({ [Segments.BODY]: registerSchema }), register);
authRouter.get('/logout', logout);
authRouter.get('/current', current);
authRouter.get("/verify/:verification_code", celebrate({ [Segments.QUERY]: verifySchema }), verifyUser);

export default authRouter;