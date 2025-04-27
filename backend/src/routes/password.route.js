import express from "express"
import {forgetPassword,radomOtpNew,validateCodeOtp,changePassword} from "../controllers/password.controller.js"

const routes = express.Router()

routes.post("/emailVerif", forgetPassword);
routes.post("/newOtp", radomOtpNew);
routes.post("/validateOtp", validateCodeOtp);
routes.patch("/changePassword/:email", changePassword);


export default routes;