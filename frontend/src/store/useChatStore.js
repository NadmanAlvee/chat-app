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
			const { authUser } = useAuthStore.getState();
			const selectedUser = selectedConversation?.participants?.find(
				(user) => user._id.toString() !== authUser._id.toString()
			);
			const response = await axiosInstance.post(
				`/message/send/${selectedConversation._id}/${selectedUser._id}`,
				messageData
			);
			set({ messages: [...messages, response.data] });
		} catch (error) {
			toast.error(error.response.data.message);
		}
	},

	subscribeToMessage: () => {
		const { selectedConversation } = get();
		const { authUser } = useAuthStore.getState();
		const selectedUser = selectedConversation?.participants?.find(
			(user) => user._id.toString() !== authUser._id.toString()
		);
		if (!selectedUser) return;
		const socket = useAuthStore.getState().socket;

		// optimize later
		socket.on("newMessage", (newMessage) => {
			if (newMessage?.senderId != selectedUser?._id) return;
			set({
				messages: [...get().messages, newMessage],
			});
		});
	},

	unsubscribeFromMessage: () => {
		const socket = useAuthStore.getState().socket;
		socket.off("newMessage");
	},

	setSelectedConversation: (conversationId) =>
		set({ selectedConversation: conversationId }),
}));
