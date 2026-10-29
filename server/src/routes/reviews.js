import { Router } from 'express';
import { Review, Booking } from '../models.js';
import { protect } from '../middleware/auth.js';
const router=Router();
router.get('/',async(req,res,next)=>{try{const q=req.query.roomId?{room:req.query.roomId}:{};res.json({reviews:await Review.find(q).populate('user','name').populate('room','name').sort({createdAt:-1}).limit(100)})}catch(e){next(e)}});
router.post('/',protect,async(req,res,next)=>{try{const rating=Number(req.body.rating),roomId=req.body.roomId,comment=String(req.body.comment||'').slice(0,1000);if(!Number.isInteger(rating)||rating<1||rating>5)return res.status(400).json({message:'Rating must be from 1 to 5.'});const stayed=await Booking.exists({user:req.user._id,room:roomId,status:{$in:['Checked-out']}});if(!stayed)return res.status(403).json({message:'You can review a room after a completed stay.'});const review=await Review.create({user:req.user._id,room:roomId,rating,comment});res.status(201).json({review})}catch(e){next(e)}});
export default router;
