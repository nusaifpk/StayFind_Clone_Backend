import Joi from "joi";

export const joiUserSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.number().min(10),
    username: Joi.string().min(4),
    password: Joi.string().min(4),
})

export const joiPropertySchema = Joi.object({
    name: Joi.string(),
    guest: Joi.string(),
    bedroom: Joi.string(),
    bathroom: Joi.string(),
    image: Joi.string(), 
    new_price: Joi.number(),
    old_price: Joi.number(),
}) 