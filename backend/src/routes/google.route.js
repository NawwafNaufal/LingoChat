import express  from "express"
const router = express.Router()
import {passportGoogle} from "../controllers/authControllerGoogle.js"

router.get("/auth/google", passportGoogle.googleAuth);          
router.get("/auth/google/callback", passportGoogle.googleCallback); 

export default router;