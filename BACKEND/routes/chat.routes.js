import {Router} from 'express';
import { sendMessage, getChats, getMessages, deleteChat } from '../controller/chat.controller.js';
import {authUser} from '../middleware/auth.middleware.js';
import chatLimiter from '../middleware/chatLimiter.middleware.js';
const chatRouter = Router();

/**
 * @swagger
 * /api/chat/message:
 *   post:
 *   summary: Send a message in a chat
 *  description: Sends a message in a chat and generates a response from the assistant.
 */
chatRouter.post('/message',authUser, chatLimiter, sendMessage);

/**
 * @swagger
 * /api/chat:
 *  get:
 *   summary: Get all chats for a user
 *   description: Retrieves a list of all chats for the authenticated user.
 */
chatRouter.post('/',authUser,getChats);

/** 
 * @swagger
 * /api/chat/{chatId}/messages:
 *   get:
 *  summary: Get messages for a specific chat
 * description: Retrieves a list of messages for a specific chat identified by chatId.
*/
chatRouter.get('/:chatId/messeges',authUser,getMessages);

/** 
 * @swagger
 * /api/chat/{chatId}/delete:
 *   delete:
 *  summary: Delete a specific chat
 * description: Deletes a specific chat identified by chatId.
 */
chatRouter.delete('/:chatId/delete',authUser, deleteChat );

export default chatRouter;