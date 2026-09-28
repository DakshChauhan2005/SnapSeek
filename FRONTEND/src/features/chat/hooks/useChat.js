import { initSocket } from "../chat.socket";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
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
import { getSocket, joinChatRoom } from "../chat.socket";
export const useChat = () => {
    const {currentChatId} = useSelector((state) => state.chat);
    const dispatch = useDispatch();
    
    useEffect(() => {
        const socket = getSocket();
        if(!socket) return;
        dispatch

        const onStreamEvent = (event) => {
            const {chatId, type} = event;
            if( type === "token"){
                dispatch(appendStreamToken({chatId, token: event.content}));
            } else if (type === "done" || type === "saved") {
                dispatch(finalizeStreamingMessage({ chatId }));
                dispatch(setLoading(false));
            } else if (type === "error") {
                dispatch(finalizeStreamingMessage({ chatId }));
                dispatch(setLoading(false));
                dispatch(setError(event.message || 'Failed to generate a response'));
                toast.error(event.message || 'Failed to generate a response');
            } else if (type === "tool_call") {
                toast.info(`Tool call event received  ${event.name}`);
            }
        };
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
            toast.error(error.response?.data?.message || 'Failed to send message');
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetMessages = useCallback(async (chatId) => {
        dispatch(setError(null));
        try {
            joinChatRoom(chatId);
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
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to fetch chats'));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);
    const handleDeleteChat = useCallback(async (chatId) => {
        dispatch(setError(null));
        dispatch(setLoading(true));
        try {
            await deleteChat(chatId);
            await handleGetChats();
            if(chatId === currentChatId){
                dispatch(setCurrentChatId(null));
            }
            toast.success('Chat deleted successfully');
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to delete chat'));
        } finally {
            dispatch(setLoading(false));
        }
    }, [currentChatId, dispatch, handleGetChats]);
    return {
        initSocket,
        handleSendMessage,
        handleGetChats,
        handleGetMessages,
        handleDeleteChat,
    };
}