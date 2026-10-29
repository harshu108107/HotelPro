import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const userSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['guest','staff','admin'], default: 'guest' },
  phone: { type: String, default: '' },
  active: { type: Boolean, default: true }
}, { timestamps: true });
const roomSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Standard','Deluxe','Suite'], required: true },
  description: { type: String, default: '' },
  price: { type: Number, min: 0, required: true },
  capacity: { type: Number, min: 1, default: 2 },
  size: { type: String, default: '28 m²' },
  beds: { type: String, default: '1 Queen Bed' },
  image: { type: String, default: '' },
  status: { type: String, enum: ['Available','Occupied','Cleaning','Maintenance'], default: 'Available' },
  active: { type: Boolean, default: true }
}, { timestamps: true });
const bookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, min: 1, required: true },
  total: { type: Number, min: 0, required: true },
  status: { type: String, enum: ['Confirmed','Cancelled','Checked-in','Checked-out'], default: 'Confirmed' },
  paymentStatus: { type: String, enum: ['Unpaid','Paid','Refund requested','Refunded'], default: 'Unpaid' },
  paymentReference: { type: String, default: '' }
}, { timestamps: true });
bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1, status: 1 });
const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 1000, default: '' }
}, { timestamps: true });
export const User = model('User', userSchema);
export const Room = model('Room', roomSchema);
export const Booking = model('Booking', bookingSchema);
export const Review = model('Review', reviewSchema);
