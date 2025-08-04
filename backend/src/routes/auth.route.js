import { Router } from "express";
import {
	signup,
	login,
	logout,
	updateProfile,
	checkAuth,
	updateGroupName,
	updateGroupPicture,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

router.put("/update-group-name", protectRoute, updateGroupName);

router.put("/update-group-picture", protectRoute, updateGroupPicture);

export default router;
