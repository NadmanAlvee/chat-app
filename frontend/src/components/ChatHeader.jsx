import { useEffect, useState } from "react";
import { X, Ellipsis, Camera, Check, Mail } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
	const {
		selectedConversation,
		setSelectedConversation,
		handleActionFromSearchResult,
		selectedUsersFromSearch,
		setSelectedUsersFromSearch,
	} = useChatStore();
	const {
		authUser,
		onlineUsers,
		isUpdatingGroupPicture,
		updateGroupPicture,
		changeGroupName,
	} = useAuthStore();

	const selectedUser = selectedConversation?.participants.find(
		(user) => user._id.toString() !== authUser._id.toString()
	);
	let conversationPicture = selectedConversation.isGroup
		? selectedConversation.groupPicture || "/group-avatar.png"
		: selectedUser.profilePic || "/avatar.png";

	let conversationName = selectedConversation.isGroup
		? selectedConversation.name || "Unnamed Group"
		: selectedUser.fullname || "/avatar.png";

	let conversationEmail = selectedConversation.isGroup
		? null
		: selectedUser.email || "hidden information";

	const [groupInfoDivVisible, setGroupInfoDivVisible] = useState(false);
	const [selectedImg, setSelectedImg] = useState(null);

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onload = async () => {
			const base64Image = reader.result;
			setSelectedImg(base64Image);
			await updateGroupPicture({
				selectedConversation,
				groupPicture: base64Image,
			});
		};
	};

	const [groupNameInput, setGroupNameInput] = useState(
		selectedConversation?.name || "Unnamed Group"
	);

	async function handleGroupNameChange(e) {
		e.preventDefault();
		if (!groupNameInput.trim()) return;

		try {
			await changeGroupName({
				selectedConversation,
				name: groupNameInput,
			});
		} catch (error) {
			console.error("Failed to send message:", error);
		}
	}

	useEffect(() => {
		if (selectedConversation?.isGroup) {
			setGroupNameInput(selectedConversation.name || "Unnamed Group");
			setSelectedImg(selectedConversation.groupPicture || null);
		}
	}, [selectedConversation]);

	useEffect(() => {
		setGroupInfoDivVisible(false);
		setGroupNameInput(selectedConversation?.name || "Unnamed Group");
		setSelectedImg(null);
	}, [selectedConversation?._id]);

	return (
		<div className="p-2.5 border-b border-base-300 flex flex-row justify-between items-center">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					{/* Avatar */}
					<div className="avatar">
						<div className="size-10 rounded-full relative">
							<img src={conversationPicture} alt={conversationName} />
						</div>
						{!selectedConversation.isGroup &&
							(onlineUsers.includes(selectedUser._id) ? (
								<span
									className="absolute bottom-0 right-0 size-3 bg-green-500 
                                    rounded-full ring-2 ring-zinc-900"
								/>
							) : (
								<span
									className="absolute bottom-0 right-0 size-3 bg-gray-400 
                                    rounded-full ring-2 ring-zinc-800"
								/>
							))}
					</div>

					{/* User info */}
					<div>
						<h3 className="font-medium">{conversationName}</h3>
						{!selectedConversation.isGroup && (
							<p className="text-sm text-base-content/70">
								{onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
							</p>
						)}
					</div>
				</div>
			</div>

			<div>
				<Ellipsis
					onClick={() => setGroupInfoDivVisible(!groupInfoDivVisible)}
					className={`btn btn-sm btn-ghost ${
						groupInfoDivVisible ? "bg-primary text-primary-content" : ""
					}`}
				/>
				<X
					onClick={() => setSelectedConversation(null)}
					className="btn btn-sm btn-ghost"
				></X>
			</div>

			{/* Group information div */}
			{groupInfoDivVisible && (
				<div
					className="fixed bg-base-300 w-full max-w-4xl max-[684px]:h-[70vh] text-center z-50 rounded-lg border-2 shadow-2xl"
					style={{
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
					}}
				>
					{/* Make container relative so the close button is absolutely positioned inside it */}
					<div className="relative max-h-[80vh] overflow-y-auto p-8">
						<X
							className="absolute top-4 right-4 size-8 text-red-500 cursor-pointer z-10"
							onClick={() => setGroupInfoDivVisible(false)}
						/>
					</div>
					<div className="bg-base-300 rounded-xl p-6 max-[684px]:p-1 space-y-8 max-[684px]:space-y-6">
						{selectedConversation.isGroup && (
							<div className="text-center">
								<h1 className="text-2xl font-semibold ">
									{selectedConversation.isGroup
										? selectedConversation?.name || "Unnamed Group"
										: conversationName || "Unknown"}
								</h1>
							</div>
						)}

						{/* Group photo updating */}
						{selectedConversation.isGroup ? (
							<div className="flex flex-col items-center gap-4">
								<div className="relative">
									<img
										src={
											selectedImg ||
											selectedConversation.groupPicture ||
											"/group-avatar.png"
										}
										alt="Profile"
										className="size-32 rounded-full object-cover border-4 "
									/>

									<label
										htmlFor="avatar-upload"
										className={`
											absolute bottom-0 right-0 
											bg-base-content hover:scale-105
											p-2 rounded-full cursor-pointer 
											transition-all duration-200
											${isUpdatingGroupPicture ? "animate-pulse pointer-events-none" : ""}`}
									>
										<Camera className="w-5 h-5 text-base-200" />
										<input
											type="file"
											id="avatar-upload"
											className="hidden"
											accept="image/*"
											onChange={handleImageUpload}
											disabled={isUpdatingGroupPicture}
										/>
									</label>
								</div>
								<p className="text-sm">
									{isUpdatingGroupPicture
										? "Uploading..."
										: "Click the camera icon to update group picture"}
								</p>
							</div>
						) : (
							<div className="flex flex-col items-center gap-4">
								<div className="relative">
									<img
										src={conversationPicture || "/avatar.png"}
										alt="Profile"
										className="size-32 rounded-full object-cover border-4 "
									/>
								</div>
								{!selectedConversation.isGroup && (
									<div className="text-center">
										<h1 className="text-2xl font-semibold ">
											{selectedConversation.isGroup
												? selectedConversation?.name || "Unnamed Group"
												: conversationName || "Unknown"}
										</h1>
										<p className="text-sm flex flex-row items-center p-2.5 gap-1">
											<Mail className="h-4" /> Email: {conversationEmail}
										</p>
									</div>
								)}
							</div>
						)}

						{/* Group name and members */}
						{selectedConversation.isGroup && (
							<div className="space-y-6">
								<div className="space-y-1.5">
									<form onSubmit={handleGroupNameChange}>
										<label className="text-sm flex items-center justify-center gap-2">
											Group Name :
											<input
												type="text"
												className="input px-4 py-2.5 bg-base-200 rounded-lg border text-sm"
												value={groupNameInput}
												onChange={(e) => setGroupNameInput(e.target.value)}
											/>
											<button
												type="submit"
												className="btn btn-outline btn-success h-10 min-h-0"
												disabled={!groupNameInput.trim()}
											>
												<Check size={22} />
											</button>
										</label>
									</form>
								</div>
							</div>
						)}
						{selectedConversation.isGroup && (
							<div className="mt-6 bg-base-300 rounded-xl p-6 max-[684px]:p-3 max-w-full overflow-hidden">
								<h2 className="text-lg font-bold mb-8">Group Members</h2>
								<div className="overflow-y-auto max-h-80 max-[684px]:max-h-50 w-full flex flex-col items-start gap-5 max-[684px]:gap-2">
									{selectedConversation?.participants.map((member) => (
										<div className="flex flex-row" key={member._id}>
											<div>
												<div className="flex items-start justify-between gap-3 pb-3">
													{/* Avatar */}
													<div className="avatar">
														<div className="size-10 rounded-full relative">
															<img
																src={member?.profilePic || "/avatar.png"}
																alt={member?.fullname || "Unknown User"}
															/>
														</div>
														{onlineUsers.includes(member?._id) ? (
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

													{/* User info */}
													<div className="text-start">
														<h3 className="font-bold ">
															{member?.fullname || "Unknown User"}
														</h3>

														<p className="text-sm text-base-content/70">
															{onlineUsers.includes(member?._id)
																? "Online"
																: "Offline"}
														</p>
													</div>
												</div>
											</div>
											<div>
												{selectedConversation?.admins?.includes(member._id) ? (
													<p className="btn p-2 ml-5 bg-accent text-accent-content">
														Admin
													</p>
												) : null}
											</div>
											<button
												className="btn p-2 ml-5"
												onClick={() => {
													setSelectedUsersFromSearch([
														...selectedUsersFromSearch,
														member,
													]);
													handleActionFromSearchResult();
												}}
											>
												Send Message
											</button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
export default ChatHeader;
