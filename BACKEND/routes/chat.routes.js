import {Router} from 'express';
import { sendMessage, getChats, getMessages, deleteChat } from '../controller/chat.controller.js';
import {authUser} from '../middleware/auth.middleware.js';
const chatRouter = Router();

chatRouter.post('/message',authUser,sendMessage);
chatRouter.post('/',authUser,getChats);
chatRouter.get('/:chatId/messeges',authUser,getMessages);
chatRouter.delete('/:chatId/delete',authUser, deleteChat );

export default chatRouter;