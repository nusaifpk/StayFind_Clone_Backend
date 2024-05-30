import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  hotelName: String,
  bookingId: String,
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: Number,
  amount: Number,
  currency: String,
  paymentDate: Date,
  paymentTime: String,
  receipt: String,

  isDeleted: {
    type: Boolean,
    default: false
  },
  
  user: { type: mongoose.Schema.ObjectId, ref: 'users' },
  property: { type: mongoose.Schema.ObjectId, ref: 'properties' }
}, { timestamps: true });

const bookingModel = mongoose.model('bookings', bookingSchema);

export default bookingModel;
