import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        createNewChat: (state, action) => {
            const newChatId = action.payload.id;
            state.chats[newChatId] = action.payload;
            state.currentChatId = newChatId;
        },
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        upsertChat: (state, action) => {
            const chatId = action.payload._id;
            state.chats[chatId] = {
                ...state.chats[chatId],
                ...action.payload,
            };
        },
        setChatMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages = messages;
            }
        },
        appendChatMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages = [
                    ...(state.chats[chatId].messages || []),
                    ...messages,
                ];
            }
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        addMessageToChat: (state, action) => {
            const { chatId, message, role} = action.payload;
            state.chats[chatId].messages.push({ content: message, role });
        },
        appendStreamToken: (state, action) => {
            const { chatId, token } = action.payload;
            const messages = state.chats[chatId]?.messages;
            if (!messages) return;
            const last = messages[messages.length - 1];
            if (last?.role === "assistant" && last.streaming) {
                last.content += token;
            }
        },
        finalizeStreamingMessage: (state, action) => {
            const { chatId } = action.payload;
            const messages = state.chats[chatId]?.messages;
            if (!messages) return;
            const last = messages[messages.length - 1];
            if (last?.role === "assistant") last.streaming = false;
        },
    },
});
export const {
    setChats,
    upsertChat,
    setChatMessages,
    appendChatMessages,
    setCurrentChatId,
    setLoading,
    setError,
    addMessageToChat,
    appendStreamToken,
    finalizeStreamingMessage,
} = chatSlice.actions;
export default chatSlice.reducer;