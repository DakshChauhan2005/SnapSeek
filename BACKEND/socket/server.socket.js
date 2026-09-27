import {Server} from 'socket.io';
import jwt from 'jsonwebtoken';
import deviceModel from '../model/device.model.js';
import chatModel from '../model/chat.model.js';

let io;

function parseCookie(rawCookie, name) {
    if (!rawCookie) return null;
    const match = rawCookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
    return match ? decodeURIComponent(match[1]) : null;
}

async function getUserIdFromSocket(socket) {
    try {
        const token = parseCookie(socket.handshake.headers.cookie, 'token');
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const device = await deviceModel.findOne({ userId: decoded.id, deviceType: decoded.deviceType });
        if (!device || device.deviceId !== decoded.deviceId) return null;

        return decoded.id;
    } catch (error) {
        return null;
    }
}

export function initSocket(httpServer) {
    io = new Server(httpServer , {
        cors: {
            origin: process.env.FRONTEND_URL ,
            credentials: true,
        }
    });
    console.log("Socket.io initialized");

    // Identify the socket's user (if any) up front, same JWT + device check
    // as the REST authUser middleware. We don't reject the handshake outright
    // on failure (keeps reconnects graceful) — join_chat below is what
    // actually enforces access.
    io.use(async (socket, next) => {
        socket.userId = await getUserIdFromSocket(socket);
        next();
    });

    io.on('connection', (socket) => {
        console.log("A user is connected: " + socket.id);

        socket.on('join_chat', async (chatId) => {
            if (!socket.userId) {
                console.log(`Socket ${socket.id} rejected join to ${chatId}: not authenticated`);
                return;
            }
            try {
                const chat = await chatModel.findOne({ _id: chatId, user: socket.userId });
                if (!chat) {
                    console.log(`Socket ${socket.id} rejected join to ${chatId}: not owner`);
                    return;
                }
                socket.join(chatId);
                console.log(`Socket ${socket.id} joined chat ${chatId}`);
            } catch (error) {
                console.log(`Socket ${socket.id} rejected join to ${chatId}: invalid chat id`);
            }
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