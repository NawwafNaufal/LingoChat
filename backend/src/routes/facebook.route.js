import express  from "express"
const router = express.Router()
import { passportGithub } from "../controllers/authFb.controller.js";

router.get("/auth/github", passportGithub.githubOAuth);
router.get("/auth/github/callback", passportGithub.githubCallback);

export default router;