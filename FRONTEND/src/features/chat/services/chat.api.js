// import axios from 'axios';

const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
import api from '../../../utils/axios.api';
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

export const sendMessage = async (chatId, message) => {
    const response = await api.post('/api/chats/message', { chatId, message });
    return response.data;
}

export const getChats = async () => {
  const response = await api.post('/api/chats/');
    return response.data;
}

export const getMesseges = async (chatId) => {
  const response = await api.get(`/api/chats/${chatId}/messeges`);
    return response.data;
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chat/${chatId}/delete`);
    return response.data;
}