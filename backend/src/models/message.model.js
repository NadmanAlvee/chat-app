import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		conversationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
		},
		text: {
			type: String,
		},
		image: {
			type: String,
		},
		readBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
