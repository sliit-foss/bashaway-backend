import express from 'express'
import {getQuestionSubmission} from '../controllers/dashboard'
const dashboardRouter = express.Router();

dashboardRouter.get("/submissions", getQuestionSubmission);

export default dashboardRouter;