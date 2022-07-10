import express from 'express';
import { create } from '../controllers/submission';

const authRouter = express.Router();

authRouter.post('/create', create);

export default authRouter;