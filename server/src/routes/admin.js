import { Router } from 'express';
import { User, Room, Booking } from '../models.js';
import { protect, allow } from '../middleware/auth.js';
const router=Router();router.use(protect,allow('admin'));
router.get('/dashboard',async(_req,res,next)=>{try{const [users,rooms,bookings,paid]=await Promise.all([User.countDocuments(),Room.countDocuments({active:true}),Booking.countDocuments(),Booking.aggregate([{$match:{paymentStatus:'Paid'}},{$group:{_id:null,revenue:{$sum:'$total'}}}])]);res.json({users,rooms,bookings,revenue:paid[0]?.revenue||0})}catch(e){next(e)}});
router.get('/users',async(req,res,next)=>{try{const users=await User.find().select('name email role active createdAt').sort({createdAt:-1}).limit(500);res.json({users})}catch(e){next(e)}});
router.patch('/users/:id/role',async(req,res,next)=>{try{const role=req.body.role;if(!['guest','staff','admin'].includes(role))return res.status(400).json({message:'Invalid role.'});if(String(req.user._id)===req.params.id)return res.status(400).json({message:'You cannot change your own role.'});const user=await User.findByIdAndUpdate(req.params.id,{role},{new:true}).select('name email role active');if(!user)return res.status(404).json({message:'User not found.'});res.json({user})}catch(e){next(e)}});
router.patch('/users/:id/active',async(req,res,next)=>{try{if(String(req.user._id)===req.params.id)return res.status(400).json({message:'You cannot disable your own account.'});const user=await User.findByIdAndUpdate(req.params.id,{active:Boolean(req.body.active)},{new:true}).select('name email role active');if(!user)return res.status(404).json({message:'User not found.'});res.json({user})}catch(e){next(e)}});
export default router;
