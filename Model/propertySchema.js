import mongoose, { Mongoose } from 'mongoose'

const propertySchema = new mongoose.Schema({
    name:String,
    guest:String,
    bedroom:String,
    bathroom:String,
    image:String,
    new_price:Number,
    old_price:Number
})

const propertyModel = mongoose.model('properties', propertySchema)
export default propertyModel   
