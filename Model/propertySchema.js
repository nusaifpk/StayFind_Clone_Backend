import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema({
    name:String,
    category:String,
    location:String,
    guest:String,
    bedroom:String,
    bathroom:String,
    description:String, 
    images:[{
        type:String
    }],
    price:Number,
    reviews: [{ type: mongoose.Schema.ObjectId, ref: 'reviews' }],
},
{timestamps:true})

const propertyModel = mongoose.model('properties', propertySchema)
export default propertyModel   
