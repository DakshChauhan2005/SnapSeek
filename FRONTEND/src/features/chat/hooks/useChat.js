import { initializeSocketConnection } from "../services/chat.socket";
import { useCallback, useEffect } from "react";
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
    appendStreamToken,
    finalizeStreamingMessage
} from "../chat.slice";
import { getSocket } from "../chat.socket";
export const useChat = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = getSocket();
        if(!socket) return;

        const onStreamEvent = (event) => {
            const {chatId, type} = event;
            if( type === "token"){
                dispatch(appendStreamToken({chatId, token: event.content}));
            } else if (type === "done" || type === "saved") {
                dispatch(finalizeStreamingMessage({ chatId }));
                dispatch(setLoading(false));
            }
            // type === "tool_call" → hook up a "searching..." indicator later
        }
        socket.on("stream_event", onStreamEvent);
        return () => socket.off("stream_event", onStreamEvent);
    }, []);

    const handleSendMessage = useCallback(async ({ message, chatId }) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await sendMessage(chatId, message); // now just an ack
            const { chat } = response;

            dispatch(upsertChat(chat));
            dispatch(setCurrentChatId(chat._id));
            joinChatRoom(chat._id);

            dispatch(appendChatMessages({
                chatId: chat._id,
                messages: [
                    { content: message, role: "user" },
                    { content: "", role: "assistant", streaming: true }, // placeholder
                ],
            }));
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to send message'));
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