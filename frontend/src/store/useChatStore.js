import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
	messages: [],
	users: [],
	selectedUser: null,
	isUsersLoading: false,
	isMessagesLoading: false,

	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			const response = await axiosInstance.get("/message/users");
			set({ users: response.data });
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isUsersLoading: false });
		}
	},

	getMessages: async (userId) => {
		set({ isMessagesLoading: true });
		try {
			const response = await axiosInstance.get(`/message/${userId}`);
			set({ messages: response.data });
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isMessagesLoading: false });
		}
	},

	sendMessage: async (messageData) => {
		try {
			const { selectedUser, messages } = get();
			const response = await axiosInstance.post(
				`/message/send/${selectedUser._id}`,
				messageData
			);
			set({ messages: [...messages, response.data] });
		} catch (error) {
			toast.error(error.response.data.message);
		}
	},

	subscribeToMessage: () => {
		const { selectedUser } = get();
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

	setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
