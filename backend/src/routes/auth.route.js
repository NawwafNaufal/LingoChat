import express from "express";
import { checkAuth, login, logout, signup, updateProfile,updateUsername,updateDescription} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {changePassword} from '../controllers/password.controller.js'

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/emaiVerif", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);
router.put("/update-username", protectRoute, updateUsername);
router.put("/update-description", protectRoute, updateDescription);
router.patch("/change-password/:email", protectRoute, changePassword);

router.get("/check", protectRoute, checkAuth);

export default router;
