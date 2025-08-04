import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
	users: [],
	messages: [],
	conversations: [],
	selectedConversation: null,
	isConversationsLoading: false,
	isMessagesLoading: false,
	isCreatingNewConversation: false,
	setIsCreatingNewConversation: (value) =>
		set({ isCreatingNewConversation: value }),

	getUsers: async () => {
		set({ isConversationsLoading: true });
		try {
			const response = await axiosInstance.get("/message/getUsers");
			set({ users: response.data });
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isConversationsLoading: false });
		}
	},

	getConversations: async () => {
		set({ isConversationsLoading: true });
		try {
			const response = await axiosInstance.get("/message/getConversations");
			set({ conversations: response.data });
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isConversationsLoading: false });
		}
	},

	updateConversation: (updatedConversation) => {
		const { conversations } = get();
		const updatedList = conversations.map((c) =>
			c._id === updatedConversation._id ? updatedConversation : c
		);
		set({ conversations: updatedList });
	},

	getMessages: async (conversationId) => {
		set({ isMessagesLoading: true });
		try {
			const response = await axiosInstance.get(`/message/${conversationId}`);
			set({ messages: response.data });
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isMessagesLoading: false });
		}
	},

	sendMessage: async (messageData) => {
		try {
			const { selectedConversation, messages } = get();
			if (selectedConversation) {
				const response = await axiosInstance.post(
					`/message/send/${selectedConversation._id}`,
					messageData
				);
				set({ messages: [...messages, response.data] });
			} else throw new Error("Error sending message");
		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
		}
	},

	subscribeToMessage: () => {
		try {
			const { selectedConversation } = get();
			const socket = useAuthStore.getState().socket;

			if (!socket || !selectedConversation?._id) return;

			socket.off("newMessage"); // Prevent duplicate listeners

			if (selectedConversation) {
				// send join room event
				socket.emit("joinRoom", selectedConversation._id);
				// listen for message
				socket.on("newMessage", (newMessage) => {
					if (newMessage?.conversationId != selectedConversation?._id) return;
					set({
						messages: [...get().messages, newMessage],
					});
				});
			} else throw new Error("Unknown error occured");
		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
		}
	},

	unsubscribeFromMessage: () => {
		const socket = useAuthStore.getState().socket;
		if (socket) socket.off("newMessage");
	},

	setSelectedConversation: (conversation) =>
		set({ selectedConversation: conversation }),
}));
