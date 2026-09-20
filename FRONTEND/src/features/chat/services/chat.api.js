import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const sendMessage = async (chatId, message) => {
    const response = await api.axios.post('/api/chat/messege', { chatId, message });
    return response.data;
}

export const getChats = async () => {
    const response = await api.post('/api/chat/');
    return response.data;
}

export const getMesseges = async (chatId) => {
    const response = await api.get(`/api/chat/${chatId}/messeges`);
    return response.data;
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chat/${chatId}/delete`);
    return response.data;
}