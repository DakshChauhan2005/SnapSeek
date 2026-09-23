import {Server} from 'socket.io';

let io;


export function initSocket(httpServer) {
    io = new Server(httpServer , {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        }
    });
    console.log("Socket.io initialized");
    io.on('connection', (socket) => {
        console.log("A user is connected: " + socket.id);

        socket.on('join_chat', (chatId) => {
            socket.join(chatId);
            console.log(`Socket ${socket.id} joined chat ${chatId}`);
        });

        socket.on('disconnect', () => {
            console.log("A user disconnected: " + socket.id);
        });
    });
}
export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}