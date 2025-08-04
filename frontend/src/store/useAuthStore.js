import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore";
import toast from "react-hot-toast";

const BASE_URL =
	import.meta.env.MODE === "development" ? "http://localhost:5001/" : "/";

export const useAuthStore = create((set, get) => ({
	authUser: null,
	isSigninUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	isCheckingAuth: true,
	onlineUsers: [],
	socket: null,
	isUpdatingGroupPicture: false,

	checkAuth: async () => {
		try {
			const response = await axiosInstance.get("/auth/check");
			set({ authUser: response.data });
			get().connectSocket();
		} catch (error) {
			console.log("error in checkAuth: ", error);
			set({ authUser: null });
		} finally {
			set({ isCheckingAuth: false });
		}
	},
	login: async (data) => {
		try {
			set({ isLoggingIn: true });
			const response = await axiosInstance.post("/auth/login", data);
			set({ authUser: response.data });

			toast.success("Logged in successfully");
			get().connectSocket();
		} catch (error) {
			console.error(error);
			toast.error(error.response.data.message);
		} finally {
			set({ isLoggingIn: false });
		}
	},
	signup: async (data) => {
		try {
			set({ isSigninUp: true });
			const response = await axiosInstance.post("/auth/signup", data);
			set({ authUser: response.data });

			toast.success("Account Created Successfully");
			get().connectSocket();
		} catch (error) {
			console.error(error);
			toast.error(error.response.data.message);
		} finally {
			set({ isSigninUp: false });
		}
	},
	logout: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ authUser: null });
			get().disconnectSocket();

			toast.success("Logged out successfully");
		} catch (error) {
			toast.error(error.response.data.message);
		}
	},
	updateProfile: async (data) => {
		set({ isUpdatingProfile: true });
		try {
			const response = await axiosInstance.put("/auth/update-profile", data);
			set({ authUser: response.data });
			toast.success("Profile updated successfully");
		} catch (error) {
			console.log("error in update profile:", error);
			toast.error(error.response.data.message);
		} finally {
			set({ isUpdatingProfile: false });
		}
	},
	updateGroupPicture: async (data) => {
		set({ isUpdatingGroupPicture: true });
		try {
			const { selectedConversation, groupPicture } = data;
			if (!selectedConversation || !groupPicture) return;
			const response = await axiosInstance.put("/auth/update-group-picture", {
				selectedConversation,
				groupPicture,
			});
			const { setSelectedConversation, updateConversation } =
				useChatStore.getState();
			setSelectedConversation(response.data);
			updateConversation(response.data);

			toast.success("Group picture updated successfully");
		} catch (error) {
			console.log("error in updating group picture:", error);
			toast.error(error.response.data.message);
		} finally {
			set({ isUpdatingGroupPicture: false });
		}
	},
	changeGroupName: async (data) => {
		try {
			const { selectedConversation, name } = data;
			if (!selectedConversation || !name) return;
			const response = await axiosInstance.put("/auth/update-group-name", {
				selectedConversation,
				name,
			});
			const { setSelectedConversation, updateConversation } =
				useChatStore.getState();
			setSelectedConversation(response.data);
			updateConversation(response.data);

			toast.success("Group name updated successfully");
		} catch (error) {
			console.log("error in updating group name:", error);
			toast.error(error.response.data.message);
		}
	},

	connectSocket: () => {
		const { authUser } = get();
		if (!authUser || get().socket?.connected) return;

		const socket = io(BASE_URL, {
			query: {
				userId: authUser._id,
			},
		});

		socket.connect();
		set({ socket: socket });

		socket.on("getOnlineUsers", (userIds) => {
			set({ onlineUsers: userIds });
		});
	},
	disconnectSocket: () => {
		if (get().socket?.connected) get().socket.disconnect();
	},
}));
