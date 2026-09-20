import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getMesseges, deleteChat } from "../services/chat.api";
export const useChat = () => {
    return {
        initializeSocketConnection,
        sendMessage,
        getChats,
        getMesseges,
        deleteChat,
    };
}