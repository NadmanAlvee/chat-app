import { Router } from "express";

import {
	getAllUsers,
	getConversationsForSidebar,
	getMessages,
	sendMessage,
	getOrCreateConversation,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

// get all Conversations for the sidebar
router.get("/getConversations", protectRoute, getConversationsForSidebar);

// get all users
router.get("/getUsers", protectRoute, getAllUsers);

// get or create a 1 to 1 conversation
router.get("/conversation/:id", protectRoute, getOrCreateConversation);

// get messages
router.get("/:conversationId", protectRoute, getMessages);

// send messages
router.post("/send/:conversationId/:recieverId", protectRoute, sendMessage);

export default router;
