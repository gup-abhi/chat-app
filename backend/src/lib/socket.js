import { Server } from 'socket.io';
import http, { METHODS } from 'http';
import express from 'express';


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    },
})

const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const { userId } = socket.handshake.query;

    if (userId) {
        userSocketMap[userId] = socket.id;
        io.emit("online-users", Object.keys(userSocketMap));
    }

    socket.on('disconnect', () => {
        console.log('A user disconnected', socket.id);
        delete userSocketMap[userId];
        io.emit("online-users", Object.keys(userSocketMap));
    });
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

export { io, server, app };