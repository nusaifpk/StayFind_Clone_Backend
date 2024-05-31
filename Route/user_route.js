import express from "express"
import tryCatchMiddleware from '../Middleware/tryCatch.js'
import verifyToken from "../Middleware/userAuth.js"
import { addReview, addToWishlist, completeRegistration, deleteAllWishlist, deleteBooking, deleteWishlist, editProfile, getBooking, payment, sendEnquiry, sendPaymentEmail, userLogin, userRegister, viewProfile, viewProperty, viewPropertyById, viewReviews, viewWishList } from "../Controller/userController.js"
import { sendOTP, verifyOTP } from "../Controller/Verify_OTP.js"

const user_router = express.Router()

user_router
    .post("/register", tryCatchMiddleware(userRegister))
    .post("/sentotp", tryCatchMiddleware(sendOTP))
    .post("/verifyotp", tryCatchMiddleware(verifyOTP))
    .post("/register/success", tryCatchMiddleware(completeRegistration))
    .post("/login", tryCatchMiddleware(userLogin))

    .get('/properties', tryCatchMiddleware(viewProperty))
    .get('/properties/:id', tryCatchMiddleware(viewPropertyById))
    .get('/properties/:id/review', tryCatchMiddleware(viewReviews))
    .post('/enquiry', tryCatchMiddleware(sendEnquiry))

    .use(verifyToken)

    .get('/profile/:id', tryCatchMiddleware(viewProfile))
    .put('/profile/:id', tryCatchMiddleware(editProfile))
    .post('/wishlist/:id', tryCatchMiddleware(addToWishlist))
    .get('/wishlist/:id', tryCatchMiddleware(viewWishList))
    .delete('/wishlist/:id', tryCatchMiddleware(deleteWishlist))
    .delete('/wishlist/all/:id', tryCatchMiddleware(deleteAllWishlist))
    .post('/review', tryCatchMiddleware(addReview))
    .post('/payment', tryCatchMiddleware(payment))
    .post('/payment/success', tryCatchMiddleware(sendPaymentEmail))
    .get('/booking/:userId', tryCatchMiddleware(getBooking))
    .put('/booking/:userId', tryCatchMiddleware(deleteBooking))
export default user_router
