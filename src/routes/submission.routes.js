import express from 'express';
import { create } from '../controllers/submission';

const submissionRouter = express.Router();

submissionRouter.post('/create', create);

export default submissionRouter;