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
		// origin: JSON.parse(process.env.ALLOWED_ORIGINS),
		origin: "*",
		credentials: true,
	},
});

export function getRecieverSocketId(userId) {
	return userSocketMap[userId];
}

// to store online users
const userSocketMap = {};

io.on("connection", (socket) => {
	const userID = socket.handshake.query.userId;
	const Username = socket.handshake.query.username;
	const Address = socket.handshake.address;

	console.log(
		`A user connected. ID: ${socket.id} Address: ${Address} Name: ${Username}`
	);

	if (userID) userSocketMap[userID] = socket.id;

	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("joinRoom", (conversationId) => {
		socket.join(conversationId);
		console.log(
			`User ${socket.id} Address: ${socket.handshake.address} joined room ${conversationId}`
		);
	});

	socket.on("disconnect", () => {
		console.log(
			`A user disconnected. ID: ${socket.id} Address: ${Address} Name: ${Username}`
		);
		delete userSocketMap[userID];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { io, server, app };
