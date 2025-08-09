import express from "express";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.resolve();
dotenv.config({
	path: path.resolve(__dirname, "../.env"),
});

import cookieParser from "cookie-parser";
import cors from "cors";

import { app, server } from "./lib/socket.js";
import { connectDB } from "./lib/mongodb.config.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(
	cors({
		// origin: JSON.parse(process.env.ALLOWED_ORIGINS),
		origin: "*",
		credentials: true,
	})
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));

	app.get("*", async (req, res) => {
		res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
	});
}

server.listen(PORT, "0.0.0.0", () => {
	console.log(`Server is listening to port: ${PORT}`);
	connectDB();
});
