import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
	users: [],
	messages: [],
	conversations: [],
	isConversationsLoading: false,
	isMessagesLoading: false,
	selectedConversation: null,
	isCreatingNewConversation: false,
	selectedUsersFromSearch: [],
	searchDivVisible: false,

	// --- State setters ---
	setSelectedUsersFromSearch: (users) =>
		set({ selectedUsersFromSearch: users }),
	setIsCreatingNewConversation: (bool) =>
		set({ isCreatingNewConversation: bool }),
	setSelectedConversation: (conversation) =>
		set({ selectedConversation: conversation }),
	setSearchDivVisible: (visible) => set({ searchDivVisible: visible }),

	// --- Chat logic ---
	getUsers: async () => {
		set({ isConversationsLoading: true });
		try {
			const response = await axiosInstance.get("/message/getUsers");
			set({ users: response.data });
		} catch (error) {
			toast.error(error.response?.data?.message || "Error fetching users");
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
			toast.error(
				error.response?.data?.message || "Error fetching conversations"
			);
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
			toast.error(error.response?.data?.message || "Error fetching messages");
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
			} else throw new Error("No selected conversation");
		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
		}
	},

	subscribeToMessage: () => {
		try {
			const { selectedConversation } = get();
			const socket = useAuthStore.getState().socket;
			if (!socket || !selectedConversation?._id) return;

			socket.off("newMessage"); // Avoid duplicate listeners

			socket.emit("joinRoom", selectedConversation._id);
			socket.on("newMessage", (newMessage) => {
				if (newMessage?.conversationId !== selectedConversation._id) return;
				set((state) => ({
					messages: [...state.messages, newMessage],
				}));
			});
		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
		}
	},

	unsubscribeFromMessage: () => {
		const socket = useAuthStore.getState().socket;
		if (socket) socket.off("newMessage");
	},

	// --- Unified Chat Handler ---
	handleActionFromSearchResult: async () => {
		const {
			selectedUsersFromSearch,
			setIsCreatingNewConversation,
			setSelectedConversation,
			setSelectedUsersFromSearch,
			setSearchDivVisible,
		} = get();

		try {
			await setIsCreatingNewConversation(true);

			let data;
			if (selectedUsersFromSearch.length === 1) {
				const response = await axiosInstance.get(
					`/message/conversation/${selectedUsersFromSearch[0]._id}`
				);
				data = response.data;
			} else if (selectedUsersFromSearch.length > 1) {
				const response = await axiosInstance.post(
					"/message/conversation/group",
					{
						selectedUsers: selectedUsersFromSearch,
					}
				);
				data = response.data;
			} else {
				throw new Error("Select at least one user");
			}

			setSelectedConversation(data);
			setSelectedUsersFromSearch([]);
			setSearchDivVisible(false);
		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
		} finally {
			setIsCreatingNewConversation(false);
		}
	},
}));
