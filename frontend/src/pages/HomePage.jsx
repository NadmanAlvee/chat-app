import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

function HomePage() {
	const { selectedConversation } = useChatStore();
	return (
		<div className="h-screen bg-base-200">
			<div className="flex items-center justify-center pt-20 px-4">
				<div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)] max-[684px]:h-[75vh]">
					{!selectedConversation ? (
						<>
							<div className="flex h-full rounded-lg overflow-hidden">
								<div className="w-100">
									<Sidebar />
								</div>
								<div className="flex-1 flex  flex-col overflow-auto max-[684px]:hidden">
									<NoChatSelected />
								</div>
							</div>
						</>
					) : (
						<>
							<div className="flex h-full max-[684px]:flex-col rounded-lg overflow-hidden">
								<div className="max-[684px]:hidden">
									<Sidebar />
								</div>
								<div className="flex-1 flex  flex-col overflow-auto">
									<ChatContainer />
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default HomePage;
