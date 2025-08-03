import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.config.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

export const getAllUsers = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const filteredUser = await User.find({
			_id: { $ne: loggedInUserId },
		}).select("-password");
		res.status(200).json(filteredUser);
	} catch (error) {
		console.log(
			"Error in getConversationsForSidebar controller",
			error.message
		);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getConversationsForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const conversationsWithLoggedInUser = await Conversation.find({
			participants: loggedInUserId,
		}).populate("participants");
		res.status(200).json(conversationsWithLoggedInUser);
	} catch (error) {
		console.log(
			"Error in getConversationsForSidebar controller",
			error.message
		);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { conversationId } = req.params;
		const messages = await Message.find({ conversationId }).populate(
			"senderId",
			"-password"
		);

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { text, image } = req.body;
		const { conversationId } = req.params;
		const senderId = req.user._id;

		let imageUrl;
		if (image) {
			// upload base64 image to cloudinary
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}

		const newMessage = new Message({
			senderId,
			conversationId,
			text,
			image: imageUrl,
		});

		await newMessage.save();
		await newMessage.populate("senderId", "-password");

		console.log({ newMessage }); // debug

		// emit new message
		if (conversationId) {
			io.to(conversationId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getOrCreateConversation = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const { id: givenUserId } = req.params;

		const conversation = await Conversation.findOne({
			isGroup: false,
			participants: { $all: [givenUserId, loggedInUserId], $size: 2 },
		}).populate("participants");

		if (!conversation) {
			let newConversation = await Conversation.create({
				isGroup: false,
				participants: [givenUserId, loggedInUserId],
			});

			newConversation = await newConversation.populate("participants");

			return res.status(201).json(newConversation);
		} else {
			return res.status(200).json(conversation);
		}
	} catch (error) {
		console.log("Error in getOrCreateConversation controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getOrCreateGroupchat = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const { selectedUsers } = req.body;

		const conversation = await Conversation.findOne({
			isGroup: true,
			participants: {
				$all: [...selectedUsers, loggedInUserId],
				$size: selectedUsers.length + 1,
			},
		}).populate("participants");

		if (!conversation) {
			let newConversation = await Conversation.create({
				isGroup: true,
				admins: [loggedInUserId],
				participants: [...selectedUsers, loggedInUserId],
			});

			newConversation = await newConversation.populate("participants");

			return res.status(201).json(newConversation);
		} else {
			return res.status(200).json(conversation);
		}
	} catch (error) {
		console.log("Error in getOrCreateGroupchat controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
