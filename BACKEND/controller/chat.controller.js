import { generateResponse, generateChatTittle} from '../services/ai.service.js';
import chatModel from '../model/chat.model.js';
import messageModel from '../model/message.model.js';
import mongoose from 'mongoose';

export async function sendMessage(req, res) {
    try {
        const { message, chatId } = req.body;
        let chat;
        let title = '';

        if (!chatId) {
            // New chat
            title = await generateChatTittle(message);
            chat = await chatModel.create({
                user: req.user.id,
                title,
            });
        } else {
            // Existing chat: load the document and verify ownership
            if (!mongoose.isValidObjectId(chatId)) {
                return res.status(400).json({ message: 'Invalid chat id' });
            }
            chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }
        }

        await messageModel.create({
            chat: chat._id,
            content: message,
            role: 'user',
        });

        // Use chat._id so this works for both new and existing chats
        const messages = await messageModel
            .find({ chat: chat._id })
            .sort({ createdAt: 1 });

        const result = await generateResponse(messages);

        const aiMessage = await messageModel.create({
            chat: chat._id,
            content: result,
            role: 'assistant',
        });

        res.status(201).json({
            message,
            title,
            chat,
            aiMessage,
        });
    } catch (error) {
        console.error('sendMessage error:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
}
export async function getChats(req, res) {
    const user = req.user.id;
    const chats = await chatModel.find({ user });
    res.status(200).json({
        message: 'Chats fetched successfully',
        chats,
    });
}

export async function getMessages(req, res) {
    const { chatId } = req.params;
    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id,
    });
    if(!chat) {
        return res.status(404).json({
            message: 'Chat not found',
        });
    }
    const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });
    res.status(200).json({
        message: 'Messages fetched successfully',
        messages,
    });
}

export async function deleteChat(req, res) {
    const { chatId } = req.params;
    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id,
    });
    if(!chat) {
        return res.status(404).json({
            message: 'Chat not found',
        });
    }
    await messageModel.deleteMany({ chat: chatId });
    await chatModel.deleteOne({ _id: chatId });
    res.status(200).json({
        message: 'Chat deleted successfully',
    });
}