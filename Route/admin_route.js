import express from "express"
import tryCatchMiddleware from "../Middleware/tryCatch.js"
import { addCategory, addProperty, adminLogin, blockUser, deleteCategory, deleteProperty, editCategory, getAllBookings, unBlockUser, updateProperty, viewCategory, viewProperty, viewPropertyById, viewUser, viewUserById } from "../Controller/adminController.js"
import verifyToken from "../Middleware/adminAuth.js"
import imageUploader from "../Middleware/imageUpload/imageUpload.js"


const admin_router = express.Router()

admin_router

/**
 * @swagger
 * tags:
 *   name: Admin API
 *   description: API endpoints for Admin
 */

/**
 * @swagger
 * /api/admin/login:
 *  post:
 *      summary: Admin login
 *      description: This API allows Admin to login
 *      tags: [Admin API]
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
    .post('/login', tryCatchMiddleware(adminLogin))

    .use(verifyToken)

/**
 * @swagger
 * /api/admin/user:
 *  get:
 *      summary: Get users 
 *      description: This API retrieves all users 
 *      tags: [Admin API]
 *      responses:
 *          200:
 *              description: List of users
*/
    .get('/user', tryCatchMiddleware(viewUser))

/**
 * @swagger
 * /api/admin/user/{id}:
 *  get:
 *      summary: Get user by ID
 *      description: This API retrieves a user by their ID
 *      tags: [Admin API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: User ID
 *      responses:
 *          200:
 *              description: User details
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal server error
 */
    .get('/user/:id', tryCatchMiddleware(viewUserById))

/**
 * @swagger
 * /api/admin/user/block/{id}:
 *  put:
 *      summary: Block user
 *      description: This API blocks a user by their ID
 *      tags: [Admin API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: User ID
 *      responses:
 *          200:
 *              description: User blocked
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal server error
 */
    .put('/user/block/:id', tryCatchMiddleware(blockUser))

/**
 * @swagger
 * /api/admin/user/unblock/{id}:
 *  put:
 *      summary: Unblock user
 *      description: This API unblocks a user by their ID
 *      tags: [Admin API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: User ID
 *      responses:
 *          200:
 *              description: User unblocked
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal server error
 */
    .put('/user/unblock/:id', tryCatchMiddleware(unBlockUser))

/**
 * @swagger
 * /api/admin/property:
 *  post:
 *      summary: Add new property
 *      description: This API allows the admin to add a new property
 *      tags: [Admin API]
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Luxurious Villa
 *                          category:
 *                              type: string
 *                              example: Farm
 *                          location:
 *                              type: string
 *                              example: Ponnani, Kerala
 *                          guest:
 *                              type: number
 *                              example: 3
 *                          bedroom:
 *                              type: number
 *                              example: 2
 *                          bathroom:
 *                              type: number
 *                              example: 2
 *                          description:
 *                              type: string
 *                              example: A beautiful villa with a stunning view
 *                          images:
 *                              type: string
 *                              format: binary
 *                          price:
 *                              type: number
 *                              example: 250000
 *      responses:
 *          201:
 *              description: Property added
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 */
    .post('/property', imageUploader, tryCatchMiddleware(addProperty))

/**
 * @swagger
 * /api/admin/properties:
 *  get:
 *      summary: Get all properties
 *      description: This API retrieves all properties
 *      tags: [Admin API]
 *      responses:
 *          200:
 *              description: List of properties
 *          500:
 *              description: Internal server error
 */
    .get('/properties', tryCatchMiddleware(viewProperty))

/**
 * @swagger
 * /api/admin/properties/{id}:
 *  get:
 *      summary: Get property by ID
 *      description: This API retrieves a property by its ID
 *      tags: [Admin API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Property ID
 *      responses:
 *          200:
 *              description: Property details
 *          404:
 *              description: Property not found
 *          500:
 *              description: Internal server error
 */
    .get('/properties/:id', tryCatchMiddleware(viewPropertyById))

/**
 * @swagger
 * /api/admin/property/{id}:
 *  put:
 *      summary: Update property
 *      description: This API allows the admin to update a property by its ID
 *      tags: [Admin API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Property ID
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Luxurious Villa
 *                          category:
 *                              type: string
 *                              example: Farm
 *                          location:
 *                              type: string
 *                              example: Ponnani, Kerala
 *                          guest:
 *                              type: number
 *                              example: 3
 *                          bedroom:
 *                              type: number
 *                              example: 2
 *                          bathroom:
 *                              type: number
 *                              example: 2
 *                          description:
 *                              type: string
 *                              example: A beautiful villa with a stunning view
 *                          images:
 *                              type: string
 *                              format: binary
 *                          price:
 *                              type: number
 *                              example: 250000
 *      responses:
 *          200:
 *              description: Property updated
 *          400:
 *              description: Bad request
 *          404:
 *              description: Property not found
 *          500:
 *              description: Internal server error
 */
    .put('/property/:id', imageUploader, tryCatchMiddleware(updateProperty))

/**
 * @swagger
 * /api/admin/property/{id}:
 *  delete:
 *      summary: Delete property
 *      description: This API allows the admin to delete a property by its ID
 *      tags: [Admin API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Property ID
 *      responses:
 *          200:
 *              description: Property deleted
 *          404:
 *              description: Property not found
 *          500:
 *              description: Internal server error
 */
    .delete('/property/:id', tryCatchMiddleware(deleteProperty))

/**
 * @swagger
 * /api/admin/bookings:
 *  get:
 *      summary: Get all bookings
 *      description: This API retrieves all bookings
 *      tags: [Admin API]
 *      responses:
 *          200:
 *              description: List of bookings
 *          500:
 *              description: Internal server error
 */
    .get('/bookings', tryCatchMiddleware(getAllBookings))

/**
 * @swagger
 * /api/admin/categories:
 *  post:
 *      summary: Add new category
 *      description: This API allows the admin to add a new category
 *      tags: [Admin API]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Luxury
 *      responses:
 *          201:
 *              description: Category added
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 */
    .post('/categories', tryCatchMiddleware(addCategory))

/**
 * @swagger
 * /api/admin/categories:
 *  get:
 *      summary: Get all categories
 *      description: This API retrieves all categories
 *      tags: [Admin API]
 *      responses:
 *          200:
 *              description: List of categories
 *          500:
 *              description: Internal server error
 */
    .get('/categories', tryCatchMiddleware(viewCategory))

/**
 * @swagger
 * /api/admin/categories/{id}:
 *  put:
 *      summary: Update category
 *      description: This API allows the admin to update a category by its ID
 *      tags: [Admin API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Category ID
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Luxury
 *      responses:
 *          200:
 *              description: Category updated
 *          400:
 *              description: Bad request
 *          404:
 *              description: Category not found
 *          500:
 *              description: Internal server error
 */
    .put('/categories/:id', tryCatchMiddleware(editCategory))

/**
 * @swagger
 * /api/admin/categories/{id}:
 *  delete:
 *      summary: Delete category
 *      description: This API allows the admin to delete a category by its ID
 *      tags: [Admin API]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Category ID
 *      responses:
 *          200:
 *              description: Category deleted
 *          404:
 *              description: Category not found
 *          500:
 *              description: Internal server error
 */
    .delete('/categories/:id', tryCatchMiddleware(deleteCategory))

export default admin_router