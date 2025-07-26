import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.config.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const filteredUsers = await User.find({
			_id: { $ne: loggedInUserId },
		}).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.log("Error in getUsersForSidebar controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const messages = await Message.find({
			$or: [
				{ senderId: senderId, recieverId: userToChatId },
				{ senderId: userToChatId, recieverId: senderId },
			],
		});

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { text, image } = req.body;
		const { id: recieverId } = req.params;
		const senderId = req.user._id;

		let imageUrl;
		if (image) {
			// upload base64 image to cloudinary
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}

		const newMessage = new Message({
			senderId,
			recieverId,
			text,
			image: imageUrl,
		});

		await newMessage.save();

		// if user is online, emit new message
		const recieverSocketId = getRecieverSocketId(recieverId);
		if (recieverSocketId) {
			io.to(recieverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
