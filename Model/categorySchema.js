import mongoose, { mongo } from "mongoose";

const categorySchema = new mongoose.Schema ({
    name:String,
})

const categoryModel = mongoose.model('categories',categorySchema)
export default categoryModel