import { initSocket } from "../chat.socket";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { notifyError, notifySuccess } from "../../../utils/notify";
import { sendMessage, getChats, getMesseges, deleteChat } from "../services/chat.api";
import {
    upsertChat,
    setChats,
    setChatMessages,
    appendChatMessages,
    setCurrentChatId,
    setLoading,
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
                notifyError(event.message, 'Failed to generate a response');
            } else if (type === "tool_call") {
                toast.info(`Tool call event received  ${event.name}`);
            }
        };
        socket.on("stream_event", onStreamEvent);
        return () => socket.off("stream_event", onStreamEvent);
    }, [dispatch]);

    const handleSendMessage = useCallback(async ({ message, chatId }) => {
        dispatch(setLoading(true));
        try {
            const response = await sendMessage(chatId, message); // now just an ack
            const { chat, messages = [] } = response;
            const acknowledgedUserMessage = [...messages].reverse().find(({ role }) => role === "user") || {
                content: message,
                role: "user",
            };

            dispatch(upsertChat(chat));
            dispatch(setCurrentChatId(chat._id));
            joinChatRoom(chat._id);

            dispatch(appendChatMessages({
                chatId: chat._id,
                messages: [
                    acknowledgedUserMessage,
                    { content: "", role: "assistant", streaming: true }, // placeholder
                ],
            }));
        } catch (error) {
            notifyError(error, 'Failed to send message');
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetMessages = useCallback(async (chatId) => {
        try {
            joinChatRoom(chatId);
            const response = await getMesseges(chatId);
            dispatch(setChatMessages({ chatId, messages: response.messages || [] }));
        } catch (error) {
            notifyError(error, 'Failed to load messages');
        }
    }, [dispatch]);

    const handleGetChats = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const response = await getChats();
            const chats = response.chats || [];
            const chatsById = Object.fromEntries(
                chats.map((chat) => [chat._id, { ...chat, messages: chat.messages || [] }])
            );
            dispatch(setChats(chatsById));
        } catch (error) {
            notifyError(error, 'Failed to load chats');
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleDeleteChat = useCallback(async (chatId) => {
        dispatch(setLoading(true));
        try {
            await deleteChat(chatId);
            await handleGetChats();
            if(chatId === currentChatId){
                dispatch(setCurrentChatId(null));
            }
            notifySuccess('Chat deleted successfully');
        } catch (error) {
            notifyError(error, 'Failed to delete chat');
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