import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage,updateMessage,deleteMessage} from "../controllers/message.controller.js";
import {getUsersAll,getUserProfile} from "../controllers/getUser.controller.js"

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/getUsers",protectRoute,getUsersAll);
router.get("/:userId/profile", getUserProfile);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);
router.put("/:id", protectRoute, updateMessage);
router.delete("/:id",protectRoute,deleteMessage);

export default router;
