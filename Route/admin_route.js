import express from "express"
import tryCatchMiddleware from "../Middleware/tryCatch.js"
import { addProperty, adminLogin, blockUser, deleteProperty, getAllBookings, unBlockUser, updateProperty, viewProperty, viewPropertyById, viewUser, viewUserById } from "../Controller/adminController.js"
import verifyToken from "../Middleware/adminAuth.js"
import imageUploader from "../Middleware/imageUpload/imageUpload.js"


const admin_router = express.Router()

admin_router
    .post('/admin_login', tryCatchMiddleware(adminLogin))

    .use(verifyToken)

    .get('/user', tryCatchMiddleware(viewUser))
    .get('/user/:id', tryCatchMiddleware(viewUserById))
    .put('/user/block/:id', tryCatchMiddleware(blockUser))
    .put('/user/unblock/:id', tryCatchMiddleware(unBlockUser))
    .post('/property', imageUploader, tryCatchMiddleware(addProperty))
    .get('/properties', tryCatchMiddleware(viewProperty))
    .get('/properties/:id', tryCatchMiddleware(viewPropertyById))
    .put('/property/:id', imageUploader, tryCatchMiddleware(updateProperty))
    .delete('/property/:id', tryCatchMiddleware(deleteProperty))
    .get('/bookings', tryCatchMiddleware(getAllBookings))

export default admin_router