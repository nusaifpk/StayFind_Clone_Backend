import express from "express"
import tryCatchMiddleware from '../Middleware/tryCatch.js'
import verifyToken from "../Middleware/userAuth.js"
import { addReview, addToWishlist, completeRegistration, deleteAllWishlist, deleteBooking, deleteWishlist, editProfile, getBooking, payment, sendEnquiry, sendPaymentEmail, userLogin, userRegister, viewProfile, viewProperty, viewPropertyById, viewReviews, viewWishList } from "../Controller/userController.js"
import { sendOTP, verifyOTP } from "../Controller/Verify_OTP.js"
import { viewCategory } from "../Controller/adminController.js"

const user_router = express.Router()

user_router


/**
 * @swagger
 * tags:
 *   name: User API
 *   description: API endpoints for users
 */

/**
 * @swagger
 * /api/users/register:
 *  post:
 *      summary: User registration
 *      description: This API allows users to register
 *      tags: [User API]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Thomas Michea Shelby
 *                          email:
 *                              type: string
 *                              example: tommyshelby@gmail.com
 *                          phone:
 *                              type: number
 *                              example: 9999999999
 *                          username:
 *                              type: string
 *                              example: tommy
 *                          password:
 *                              type: string
 *                              example: password123
 *      responses:
 *          201:
 *              description: Successfully registered
 *          400:
 *              description: Username already taken
 *          500:
 *              description: Internal server error
*/
.post("/register", tryCatchMiddleware(userRegister))

/**
 * @swagger
 * /api/users/sentotp:
 *  post:
 *      summary: Send mobile OTP
 *      description: This API allows users to register
 *      tags: [User API]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          phone:
 *                              type: number
 *                              example: 9999999999
 *      responses:
 *          200:
 *              description: OTP sent
 *          400:
 *              description: Bad request
*/
.post("/sentotp", tryCatchMiddleware(sendOTP))

/**
 * @swagger
 * /api/users/verifyotp:
 *  post:
 *      summary: Verify mobile OTP
 *      tags: [User API]
 *      description: This API allows users to register
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          phone:
 *                              type: number
 *                              example: 9999999999
 *                          otp:
 *                              type: number
 *                              example: 999999
 *      responses:
 *          200:
 *              description: OTP verified
 *          400:
 *              description: Bad request
 */    
    .post("/verifyotp", tryCatchMiddleware(verifyOTP))

    .post("/register/success", tryCatchMiddleware(completeRegistration))

/**
 * @swagger
 * /api/users/login:
 *  post:
 *      summary: User login
 *      description: This API allows users to register
 *      tags: [User API]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              example: tommy
 *                          password:
 *                              type: string
 *                              example: password123
 *      responses:
 *          200:
 *              description: Successfully logged in
 *          401:
 *              description: Unauthorized
*/
.post("/login", tryCatchMiddleware(userLogin))

/**
 * @swagger
 * /api/users/categories:
 *  get:
 *      summary: Get categories
 *      description: This API retrieves all categories
 *      tags: [User API]
 *      responses:
 *          200:
 *              description: List of categories
*/
.get('/categories', tryCatchMiddleware(viewCategory))

/**
 * @swagger
 * /api/users/properties:
 *  get:
 *      summary: Get properties
 *      description: This API retrieves all properties
 *      tags: [User API]
 *      responses:
 *          200:
 *              description: List of properties
*/
.get('/properties', tryCatchMiddleware(viewProperty))

/**
 * @swagger
 * /api/users/properties/{id}:
 *  get:
 *      summary: Get property by ID
 *      description: This API retrieves a property by ID
 *      tags: [User API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Property ID
 *      responses:
 *          200:
 *              description: Successfully fetched property by ID
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: success
 *                      message:
 *                        type: string
 *                        example: fetched property by id
 *                      data:
 *                        type: object
 *                        properties:
 *                          reviews:
 *                            type: array
 *                            items:
 *                              type: object
 *                          _id:
 *                            type: string
 *                            example: 663ca4ac4738807cf0a85056
 *                          name:
 *                            type: string
 *                            example: Cottage amidst the mountains
 *                          category:
 *                            type: string
 *                            example: farm
 *                          location:
 *                            type: string
 *                            example: Munnar, Kerala
 *                          guest:
 *                            type: string
 *                            example: 4
 *                          bedroom:
 *                            type: string
 *                            example: 3
 *                          bathroom:
 *                            type: string
 *                            example: 3
 *                          description:
 *                            type: string
 *                            example: Cosy independent cottages surrounded by lush green mountains with a view of the "annaerangal" lake. Total area of the property is around 3.00 acres so lots of space for my guests to relax and enjoy
 *                          images:
 *                            type: array
 *                            items:
 *                              type: string
 *                              example: https://res.cloudinary.com/dftgdyurm/image/upload/v1715250348/Property-images/anlxbwcikwdasxbhxqdc.webp
 *                          price:
 *                            type: number
 *                            example: 3999
 *                          createdAt:
 *                            type: string
 *                            example: 2024-05-09T10:25:48.741Z
 *                          updatedAt:
 *                            type: string
 *                            example: 2024-07-15T06:44:26.757Z
 *                          __v:
 *                            type: number
 *                            example: 0
 *                          overallRating:
 *                            type: number
 *                            example: 3.5
 *          400:
 *              description: Invalid property ID
 *          404:
 *              description: Property not found
*/
.get('/properties/:id', tryCatchMiddleware(viewPropertyById))

/**
 * @swagger
 * /api/users/properties/{id}/review:
 *  get:
 *      summary: Get reviews for a property
 *      description: This API retrieves reviews for a property by ID
 *      tags: [User API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Property ID
 *      responses:
 *          200:
 *              description: List of reviews
 */    
    .get('/properties/:id/review', tryCatchMiddleware(viewReviews))

/**
 * @swagger
 * /api/users/enquiry:
 *  post:
 *      summary: Send an enquiry
 *      description: This API allows users to send an enquiry
 *      tags: [User API]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Thomas Michea Shelby
 *                          email:
 *                              type: string
 *                              example: tommyshelby@gmail.com
 *                          message:
 *                              type: string
 *                              example: I liked your website...
 *      responses:
 *          200:
 *              description: Enquiry sent
 *          400:
 *              description: Bad request
*/
.post('/enquiry', tryCatchMiddleware(sendEnquiry))

.use(verifyToken)

/**
 * @swagger
 * /api/users/profile/{id}:
 *  get:
 *      summary: View user profile
 *      description: This API retrieves the user profile by ID
 *      tags: [User API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: User ID
 *      responses:
 *          200:
 *              description: User profile data
*/
.get('/profile/:id', tryCatchMiddleware(viewProfile))

/**
 * @swagger
 * /api/users/profile/{id}:
 *  put:
 *      summary: Edit user profile
 *      description: This API allows users to edit their profile
 *      tags: [User API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: User ID
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              example: tommy
 *      responses:
 *          200:
 *              description: Profile updated
 *          400:
 *              description: Bad request
*/
    .put('/profile/:id', tryCatchMiddleware(editProfile))
    
/**
 * @swagger
 * /api/users/wishlist/{id}:
 *  post:
 *      summary: Add to wishlist
 *      description: This API allows users to add a property to their wishlist
 *      tags: [User API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Property ID
 *      responses:
 *          200:
 *              description: Property added to wishlist
 *          400:
 *              description: Bad request
*/
.post('/wishlist/:id', tryCatchMiddleware(addToWishlist))

/**
 * @swagger
 * /api/users/wishlist/{id}:
 *  get:
 *      summary: View wishlist
 *      description: This API retrieves the user's wishlist by ID
 *      tags: [User API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: User ID
 *      responses:
 *          200:
 *              description: Wishlist data
*/
.get('/wishlist/:id', tryCatchMiddleware(viewWishList))

/**
 * @swagger
 * /api/users/wishlist/{id}:
 *  delete:
 *      summary: Delete a property from wishlist
 *      description: This API allows users to delete a property from their wishlist
 *      tags: [User API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Property ID
 *      responses:
 *          200:
 *              description: Property deleted from wishlist
 *          400:
 *              description: Bad request
 */
.delete('/wishlist/:id', tryCatchMiddleware(deleteWishlist))

/**
 * @swagger
 * /api/users/wishlist/all/{id}:
 *  delete:
 *      summary: Delete all properties from wishlist
 *      description: This API allows users to delete all properties from their wishlist
 *      tags: [User API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: User ID
 *      responses:
 *          200:
 *              description: All properties deleted from wishlist
 *          400:
 *              description: Bad request
 */
    .delete('/wishlist/all/:id', tryCatchMiddleware(deleteAllWishlist))

    /**
     * @swagger
     * /api/users/review:
     *  post:
     *      summary: Add a review
     *      description: This API allows users to add a review for a property
     *      tags: [User API]
     *      requestBody:
     *          required: true
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          propertyId:
     *                              type: string
     *                              example: 60d21b4667d0d8992e610c85
     *                          review:
     *                              type: string
     *                              example: Great property!
     *      responses:
     *          200:
     *              description: Review added
     *          400:
     *              description: Bad request
    */
   .post('/review', tryCatchMiddleware(addReview))
   
 /**
 * @swagger
 * /api/users/payment:
 *  post:
 *      summary: Make a payment
 *      description: This API allows users to make a payment
 *      tags: [User API]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          amount:
 *                              type: number
 *                              example: 100
 *                          currency:
 *                              type: string
 *                              example: USD
 *      responses:
 *          200:
 *              description: Payment successful
 *          400:
 *              description: Bad request
 */
    .post('/payment', tryCatchMiddleware(payment))

/**
 * @swagger
 * /api/users/payment/success:
 *  post:
 *      summary: Send payment email
 *      description: This API sends a payment confirmation email
 *      tags: [User API]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: tommyshelby@gmail.com
 *                          amount:
 *                              type: number
 *                              example: 100
 *      responses:
 *          200:
 *              description: Email sent
 *          400:
 *              description: Bad request
 */
    .post('/payment/success', tryCatchMiddleware(sendPaymentEmail))

    /**
 * @swagger
 * /api/users/booking/{userId}:
 *  get:
 *      summary: Get bookings
 *      description: This API retrieves the user's bookings
 *      tags: [User API]
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: string
 *            required: true
 *            description: User ID
 *      responses:
 *          200:
 *              description: Booking data
 */
    .get('/booking/:userId', tryCatchMiddleware(getBooking))

/**
 * @swagger
 * /api/users/booking/{userId}:
 *  put:
 *      summary: Delete a booking
 *      description: This API allows users to delete a booking
 *      tags: [User API]
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: string
 *            required: true
 *            description: User ID
 *      responses:
 *          200:
 *              description: Booking deleted
 *          400:
 *              description: Bad request
 */
    .put('/booking/:userId', tryCatchMiddleware(deleteBooking))
export default user_router
