import {io} from "socket.io-client";

let socket = null;

export function initSocket() {
    if(socket) return socket;

    socket = io(import.meta.env.API_BASE_URL, {
        withCredentials: true,
    } );

    socket.on("connect" , () => {
        console.log("Connected to socket server with id: " + socket.id);
    })

    socket.on("disconnect" , () => {
        console.log("Disconnected from socket server");
    });

    return socket;
}

export function getSocket() {
    return socket;
}

export function joinChatRoom(chatId) {
    const socket = getSocket();
    socket.emit("join_chat", chatId);
}