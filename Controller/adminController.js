import jwt from "jsonwebtoken"
import users from '../Model/userSchema.js'
import properties from '../Model/propertySchema.js'
import {joiPropertySchema} from '../Model/validationSchema.js'

export const adminLogin = async (req,res) => {
    const {username,password} = req.body

    if(username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD){
        
        const token = jwt.sign({username},process.env.ADMIN_ACCESS_TOKEN_SECRET)

        return res.status(200).json({
            status:"success",
            message:"admin logged in successfully",
            token:token
        })
    }
    else{
        return res.status(404).json({
            status:"error",
            message:"invalid admin...!"
        })
    }
}

export const viewUser = async (req,res) => {
    const all_users = await users.find();

    if(all_users.length === 0){
        return res.status(404).json({
            status:"error",
            message:"users not Found...!"
        })
    }
    else{
        return res.status(200).json({
            status:"success",
            message:"fetched users successfully",
            data:all_users
        })
    }
}

export const viewUserById = async (req,res) => {
    const userId = req.params.id;
    const user = await users.findById(userId)

    if(!user){
        return res.status(404).json({
            status:"error",
            message:"user not found...!"
        })
    }
    else{
        return res.status(200).json({
            status:"success",
            message:"fetched user by id",
            data:user
        })
    }
}

export const addProperty = async (req,res) => {
    const {value, error} = joiPropertySchema.validate(req.body)
    const {name, guest, bedroom, bathroom, image, new_price, old_price} = value
    console.log(value);

    if(error){
        return res.status(400).json({
            error:error.details[0].message
        })
    }
    else{
        const property_data = await properties.create({
            name,
            guest,
            bedroom,
            bathroom,
            image,
            new_price,
            old_price,
        })

        return res.status(201).json({
            status:"success",
            message:"property added successfully",
            data:property_data
        })
    }
}