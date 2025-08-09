import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.resolve();
dotenv.config({
	path: path.resolve(__dirname, "../.env"),
});

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: JSON.parse(process.env.ALLOWED_ORIGINS),
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
