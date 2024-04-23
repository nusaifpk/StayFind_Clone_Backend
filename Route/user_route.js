import express from "express"
import tryCatchMiddleware from '../Middleware/tryCatch.js'
import verifyToken from "../Middleware/userAuth.js"
import {userLogin, userRegister, viewProperty} from "../Controller/userController.js"
import { sendOTP, verifyOTP } from "../Controller/Verify_OTP.js"

const user_router = express.Router()

user_router
.post("/register",tryCatchMiddleware(userRegister))
.post("/sentotp",tryCatchMiddleware(sendOTP)) 
.post("/verifyotp",tryCatchMiddleware(verifyOTP))
.post("/login",tryCatchMiddleware(userLogin))

// .use(verifyToken)

.get("/properties",tryCatchMiddleware(viewProperty))


export default user_router