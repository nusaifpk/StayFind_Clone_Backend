import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    username:String,
    password:String
})

const userModel = mongoose.model("users",userSchema)

export default userModel