import express from 'express';
import { create, getAll, getById, update, generateInvite, joinGroup, leaveGroup, removeUser } from '../controllers/group';
import { celebrate, Segments } from "celebrate"
import { createGroupSchema } from '../validations/group';

const groupRouter = express.Router();

groupRouter.post('/', celebrate({ [Segments.BODY]: createGroupSchema }), create);
groupRouter.get('/', getAll);
groupRouter.get('/invite', generateInvite);
groupRouter.get('/:id', getById);
groupRouter.get('/:id/:code', joinGroup);
groupRouter.get('/:id/leave', leaveGroup);
groupRouter.put('/:id/:remove_user', removeUser);
groupRouter.put('/:id', update);

export default groupRouter;