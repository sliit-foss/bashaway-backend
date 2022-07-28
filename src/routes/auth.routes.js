import express from 'express';
import { celebrate, Segments } from "celebrate"
import { login, register, current, verifyUser, resendVerification } from '../controllers/auth';
import { registerSchema, loginSchema, verifySchema } from "../validations/user"
import { protect } from '../middleware/auth';

const authRouter = express.Router();

authRouter.post('/login', celebrate({ [Segments.BODY]: loginSchema }), login);
authRouter.post('/register', celebrate({ [Segments.BODY]: registerSchema }), register);
authRouter.get('/current', protect, current);
authRouter.post('/verify', resendVerification);
authRouter.get("/verify/:verification_code", celebrate({ [Segments.PARAMS]: verifySchema }), verifyUser);

export default authRouter;
