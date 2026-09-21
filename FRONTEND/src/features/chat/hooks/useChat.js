import { initializeSocketConnection } from "../services/chat.socket";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { sendMessage, getChats, getMesseges, deleteChat } from "../services/chat.api";
import {
    upsertChat,
    setChats,
    setChatMessages,
    appendChatMessages,
    setCurrentChatId,
    setLoading,
    setError,
} from "../chat.slice";
export const useChat = () => {
    const dispatch = useDispatch();

    const handleSendMessage = useCallback(async ({ message, chatId }) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await sendMessage(chatId, message);
            const { chat, aiMessage } = response;
            dispatch(upsertChat(chat));
            dispatch(appendChatMessages({
                chatId: chat._id,
                messages: [{ content: message, role: "user" }, aiMessage],
            }));
            dispatch(setCurrentChatId(chat._id));
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to send message'));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetMessages = useCallback(async (chatId) => {
        dispatch(setError(null));
        try {
            const response = await getMesseges(chatId);
            dispatch(setChatMessages({ chatId, messages: response.messages || [] }));
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to fetch messages'));
        }
    }, [dispatch]);

    const handleGetChats = useCallback(async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await getChats();
            const chats = response.chats || [];
            const chatsById = Object.fromEntries(
                chats.map((chat) => [chat._id, { ...chat, messages: chat.messages || [] }])
            );
            dispatch(setChats(chatsById));
            if (chats.length > 0) {
                dispatch(setCurrentChatId(chats[0]._id));
            }
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to fetch chats'));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);
    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleGetMessages,
    };
}