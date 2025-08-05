import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
	const {
		messages,
		getMessages,
		selectedConversation,
		isMessagesLoading,
		subscribeToMessage,
		unsubscribeFromMessage,
	} = useChatStore();

	const { authUser } = useAuthStore();
	const messageDivRef = useRef(null);

	useEffect(() => {
		if (!selectedConversation?._id) return;

		getMessages(selectedConversation._id);
		subscribeToMessage();

		return () => {
			unsubscribeFromMessage();
		};
	}, [
		selectedConversation?._id,
		getMessages,
		subscribeToMessage,
		unsubscribeFromMessage,
	]);

	useEffect(() => {
		if (messageDivRef.current && messages) {
			messageDivRef.current.scrollTo(0, messageDivRef.current.scrollHeight);
		}
	}, [messages]);

	if (isMessagesLoading) {
		return (
			<div className="flex-1 flex  flex-col overflow-auto">
				<ChatHeader />
				<MessageSkeleton />
				<MessageInput />
			</div>
		);
	}

	return (
		<>
			<ChatHeader />

			<div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messageDivRef}>
				{messages.map((message) => (
					<div
						key={message?._id}
						className={`chat ${
							message?.senderId?._id === authUser?._id
								? "chat-end"
								: "chat-start"
						}`}
					>
						<div className=" chat-image avatar">
							<div className="size-10 rounded-full border">
								<img
									src={message?.senderId?.profilePic || "/avatar.png"}
									alt="profile pic"
								/>
							</div>
						</div>
						<div className="chat-header mb-1">
							<time className="text-xs opacity-50 ml-1">
								{formatMessageTime(message.createdAt)}
							</time>
						</div>
						<div
							className={`chat-bubble flex flex-col ${
								message?.senderId?._id === authUser?._id
									? "bg-primary text-primary-content"
									: "bg-base-200"
							}`}
						>
							{message.image && (
								<img
									src={message.image}
									alt="Attachment"
									className="sm:max-w-[200px] rounded-md mb-2"
								/>
							)}
							{message.text && <p>{message.text}</p>}
						</div>
					</div>
				))}
			</div>

			<MessageInput />
		</>
	);
};

export default ChatContainer;
