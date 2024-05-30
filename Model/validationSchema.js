import Joi from "joi";

export const joiUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.number().min(10),
    username: Joi.string().min(4),
    password: Joi.string().required(),
})

export const joiPropertySchema = Joi.object({
    name: Joi.string(),
    category: Joi.string(),
    location: Joi.string(),
    guest: Joi.string(),
    bedroom: Joi.string(),
    bathroom: Joi.string(),
    description: Joi.string(),
    images: Joi.array().items(Joi.string()),
    price: Joi.number().positive(),
    reviews: Joi.array().items(Joi.string())
}) 
export const joiReviewSchema = Joi.object({
    userId: Joi.string(),
    propertyId: Joi.string(),
    rating: Joi.number().min(1).max(5),
    review: Joi.string(),
}) 