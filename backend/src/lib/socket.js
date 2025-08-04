import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173", "http://103.152.106.133:5001"],
		credentials: true,
	},
});

export function getRecieverSocketId(userId) {
	return userSocketMap[userId];
}

// to store online users
const userSocketMap = {};

io.on("connection", (socket) => {
	console.log("A user connected ", socket.id);
	const userID = socket.handshake.query.userId;

	if (userID) userSocketMap[userID] = socket.id;

	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("joinRoom", (conversationId) => {
		socket.join(conversationId);
		console.log(`User ${socket.id} joined room ${conversationId}`);
	});

	socket.on("disconnect", () => {
		console.log("A user disconnected ", socket.id);
		delete userSocketMap[userID];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { io, server, app };
