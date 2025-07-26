import { Router } from "express";

import {
	getUsersForSidebar,
	getMessages,
	sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

// get all users for the sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// get messages
router.get("/:id", protectRoute, getMessages);

// send messages
router.post("/send/:id", protectRoute, sendMessage);

export default router;
