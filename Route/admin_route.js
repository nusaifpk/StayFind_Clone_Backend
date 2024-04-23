import express from "express"
import tryCatchMiddleware from "../Middleware/tryCatch.js"
import { addProperty, adminLogin, viewUser, viewUserById } from "../Controller/adminController.js"
import verifyToken from "../Middleware/adminAuth.js"
import imageUploader from "../Middleware/imageUpload/imageUpload.js"


const admin_router = express.Router()

admin_router
.post('/admin_login',tryCatchMiddleware(adminLogin))

.use(verifyToken) 

.get('/user',tryCatchMiddleware(viewUser))
.get('/user/:id',tryCatchMiddleware(viewUserById))
.post('/add_property',imageUploader,tryCatchMiddleware(addProperty))

export default admin_router