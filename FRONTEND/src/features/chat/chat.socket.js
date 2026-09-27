import {io} from "socket.io-client";

let socket = null;
let activeChatId = null; // the chat currently being viewed/streamed into

export function initSocket() {
    if(socket) return socket;

    socket = io( import.meta.env.VITE_API_BASE_URL || "http://localhost:3000", {
        withCredentials: true,
    } );

    socket.on("connect" , () => {
        console.log("Connected to socket server with id: " + socket.id);
        // On first connect AND on every reconnect, make sure we're in the
        // room for whatever chat is currently active. A reconnect gets a
        // brand-new socket.id and starts in no rooms at all, so without
        // this, a dropped connection mid-stream silently stops receiving
        // any further tokens even though the server is still emitting them.
        if (activeChatId) {
            socket.emit("join_chat", activeChatId);
        }
    })

    socket.on("disconnect" , () => {
        console.log("Disconnected from socket server");
    });

    return socket;
}

export function getSocket() {
    return socket;
}

export function getSocketId() {
    return socket?.id || null;
}

export function setActiveChatId(chatId) {
    activeChatId = chatId;
}

export function joinChatRoom(chatId) {
    const socket = getSocket();
    setActiveChatId(chatId);
    socket.emit("join_chat", chatId);
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    activeChatId = null;
}