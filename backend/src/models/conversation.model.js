import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
	{
		isGroup: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String,
			default: "",
		},
		groupPicture: {
			type: String,
		},
		admins: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],
	},
	{
		timestamps: true,
	}
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
