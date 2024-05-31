import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'users', required: true },
    propertyId: { type: mongoose.Schema.ObjectId, ref: 'properties', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
}, { timestamps: true })

const reviewModel = mongoose.model('reviews', reviewSchema);
export default reviewModel;