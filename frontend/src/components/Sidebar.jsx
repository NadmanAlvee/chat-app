import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { UserPlus, X } from "lucide-react";

const Sidebar = () => {
	const {
		getUsers,
		users,
		getConversations,
		conversations,
		selectedConversation,
		setSelectedConversation,
		isConversationsLoading,
		isCreatingNewConversation,
		handleActionFromSearchResult,
		selectedUsersFromSearch,
		setSelectedUsersFromSearch,
		searchDivVisible,
		setSearchDivVisible,
	} = useChatStore();

	const { onlineUsers, authUser } = useAuthStore();
	const [showOnlineOnly, setShowOnlineOnly] = useState(false);

	useEffect(() => {
		getUsers();
		getConversations();
	}, [getUsers, getConversations, isCreatingNewConversation]);

	const [searchedUsers, setSearchedUsers] = useState([]);
	const handleSearchInput = (e) => {
		const searchTerm = e.target.value.trim().toLowerCase();
		if (searchTerm === "") {
			setSearchedUsers([]);
			return;
		} else {
			setSearchedUsers(
				users.filter((user) => user.fullname.toLowerCase().includes(searchTerm))
			);
		}
	};

	const handleSelectedUsersFromSearch = (user) => {
		selectedUsersFromSearch.includes(user)
			? setSelectedUsersFromSearch(
					selectedUsersFromSearch.filter((u) => u != user)
			  )
			: setSelectedUsersFromSearch([...selectedUsersFromSearch, user]);
	};

	useEffect(() => {}, [selectedConversation, conversations]);

	if (isConversationsLoading) return <SidebarSkeleton />;

	return (
		<aside className="h-full w-72 max-[684px]:w-full border-r border-base-300 flex flex-col transition-all duration-200">
			{/* Search - New Message */}
			<button
				className={`w-full p-5 flex items-center gap-3 hover:bg-base-300 transition-colors border-base-300 border-b ${
					searchDivVisible ? "bg-primary text-primary-content" : ""
				}`}
				onClick={() => {
					setSelectedConversation(null);
					setSearchDivVisible(!searchDivVisible);
				}}
			>
				<div className="flex items-center gap-2 cursor-pointer justify-center">
					<UserPlus className="size-6" />
					<span className="font-medium block">New Message</span>
				</div>
			</button>

			{/* Search Input */}
			{searchDivVisible && (
				<div
					className="fixed bg-base-300 w-full max-w-4xl text-center z-50 rounded-lg border-2 p-8 shadow-2xl"
					style={{
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
					}}
				>
					<button>
						<X
							className="absolute top-2 right-2 size-8 text-red-500"
							onClick={() => {
								setSearchDivVisible(false);
								setSearchedUsers([]);
							}}
						/>
					</button>
					{selectedUsersFromSearch.length > 0 && (
						<div className="absolute bottom-0 w-full text-center">
							<button
								className="m-5 left-2/4 btn btn-outline btn-primary-content z-10"
								onClick={handleActionFromSearchResult}
							>
								{selectedUsersFromSearch.length === 1
									? "Send Message"
									: "Create Group Chat"}
							</button>
						</div>
					)}

					<input
						type="text"
						placeholder="Search"
						className="input input-bordered w-11/12 h-10 rounded-r-none m-5"
						onChange={handleSearchInput}
					/>
					{/* search results div */}
					<div
						className="flex flex-col min-h-96 overflow-y-auto pl-10 gap-3"
						style={{ maxHeight: "70vh" }}
					>
						{searchedUsers.length > 0 ? (
							searchedUsers.map((searchedUser) => (
								<button
									key={searchedUser._id}
									onClick={() => handleSelectedUsersFromSearch(searchedUser)}
									className={`max-w-80 p-3 flex items-center gap-3 z-20
												hover:border-2
                                 				hover:rounded-xl
												hover:border-primary
												transition-colors ${
													selectedUsersFromSearch.includes(searchedUser)
														? "bg-primary text-primary-content"
														: ""
												}`}
								>
									<div className="relative">
										<img
											src={searchedUser.profilePic || "/avatar.png"}
											alt={searchedUser.fullname}
											className="size-12 object-cover rounded-full"
										/>
										{onlineUsers?.includes(searchedUser._id) ? (
											<span
												className="absolute bottom-0 right-0 size-3 bg-green-500 
                                    rounded-full ring-2 ring-zinc-900"
											/>
										) : (
											<span
												className="absolute bottom-0 right-0 size-3 bg-gray-400 
                                    rounded-full ring-2 ring-zinc-800"
											/>
										)}
									</div>

									<div className="block text-left min-w-0">
										<div className="font-medium truncate">
											{searchedUser.fullname}
										</div>
										<div className="text-sm ">
											{onlineUsers.includes(searchedUser._id)
												? "Online"
												: "Offline"}
										</div>
									</div>
								</button>
							))
						) : (
							<span className="block">No User Found</span>
						)}
					</div>
				</div>
			)}

			{/* show online users toggle */}
			{/* <div className="hidden lg:flex  border-b border-base-300 w-full p-5">
				<div className="items-center gap-2">
					<label className="cursor-pointer flex items-center gap-2">
						<input
							type="checkbox"
							checked={showOnlineOnly}
							onChange={(e) => setShowOnlineOnly(e.target.checked)}
							className="checkbox checkbox-sm"
						/>
						<span className="text-sm">Show online only</span>
					</label>
					<span className="text-xs text-zinc-500">
						({onlineUsers.length - 1 > 0 ? onlineUsers.length - 1 : 0} online)
					</span>
				</div>
			</div> */}

			{/* Sidebar conversations */}
			<div className="overflow-y-auto w-full">
				{conversations.map((conversation) => {
					const isGroup = conversation.isGroup;
					const otherUser = conversation.participants.find(
						(user) => user._id.toString() !== authUser._id.toString()
					);

					const conversationImage = isGroup
						? conversation.groupPicture || "/group-avatar.png"
						: otherUser?.profilePic || "/avatar.png";
					const conversationName = isGroup
						? conversation.name || "Unnamed Group"
						: otherUser?.fullname || "Unknown";

					return (
						<button
							key={conversation._id}
							onClick={() => {
								setSearchDivVisible(false);
								setSelectedConversation(conversation);
							}}
							className={`
										w-full p-3 flex items-center gap-3
										hover:bg-base-300 transition-colors
										${
											selectedConversation?._id === conversation._id
												? "bg-base-300 ring-1 ring-base-300"
												: ""
										}
        							`}
						>
							<div className="relative ">
								<img
									src={conversationImage}
									alt={conversationName}
									className="size-12 object-cover rounded-full"
								/>
								{!isGroup && onlineUsers.includes(otherUser?._id) ? (
									<span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
								) : (
									!isGroup && (
										<span className="absolute bottom-0 right-0 size-3 bg-gray-400 rounded-full ring-2 ring-zinc-800" />
									)
								)}
							</div>

							<div className="block text-left min-w-0">
								<div className="font-medium truncate">{conversationName}</div>
								{!isGroup && (
									<div className="text-sm text-zinc-400">
										{onlineUsers.includes(otherUser?._id)
											? "Online"
											: "Offline"}
									</div>
								)}
							</div>
						</button>
					);
				})}

				{conversations.length === 0 && (
					<div className="text-center text-zinc-500 py-4">
						No Conversation Found
					</div>
				)}
			</div>
		</aside>
	);
};

export default Sidebar;
