import { Router } from 'express';
import { Booking, Room } from '../models.js';
import { protect, allow } from '../middleware/auth.js';
const router=Router();router.use(protect,allow('staff','admin'));
router.get('/overview',async(_req,res,next)=>{try{const [rooms,bookings,arrivals,departures]=await Promise.all([Room.countDocuments({active:true}),Booking.countDocuments({status:{$in:['Confirmed','Checked-in']}}),Booking.countDocuments({status:'Confirmed',checkIn:{$gte:new Date(new Date().setHours(0,0,0,0))}}),Booking.countDocuments({status:'Checked-in'})]);res.json({rooms,activeBookings:bookings,arrivals,checkedIn:departures})}catch(e){next(e)}});
router.patch('/bookings/:id/check-in',async(req,res,next)=>{try{const b=await Booking.findById(req.params.id);if(!b)return res.status(404).json({message:'Booking not found.'});if(b.status!=='Confirmed')return res.status(400).json({message:'Only confirmed reservations can check in.'});b.status='Checked-in';await b.save();await Room.findByIdAndUpdate(b.room,{status:'Occupied'});res.json({booking:b,message:'Guest checked in.'})}catch(e){next(e)}});
router.patch('/bookings/:id/check-out',async(req,res,next)=>{try{const b=await Booking.findById(req.params.id);if(!b)return res.status(404).json({message:'Booking not found.'});if(b.status!=='Checked-in')return res.status(400).json({message:'Guest must be checked in first.'});b.status='Checked-out';await b.save();await Room.findByIdAndUpdate(b.room,{status:'Cleaning'});res.json({booking:b,message:'Guest checked out. Room marked for cleaning.'})}catch(e){next(e)}});
export default router;
