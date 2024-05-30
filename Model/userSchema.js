import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    username: String,
    password: String,

    isActive: {
        type: Boolean,  
        default: true
    },

    isBlocked: {
        type: Boolean,
        default: false
    },

    wishlist: [{ type: mongoose.Schema.ObjectId, ref: 'wishlist', autopopulate: true }],
    bookings: [{ type: mongoose.Schema.ObjectId, ref: 'bookings' }],
}, { timestamps: true });

const userModel = mongoose.model("users", userSchema);

export default userModel;
