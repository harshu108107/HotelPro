import { Router } from 'express';
import { Room, Booking } from '../models.js';
import { protect, allow } from '../middleware/auth.js';
const router=Router();
router.get('/',async(req,res,next)=>{try{
 const q={active:true}; if(req.query.category && req.query.category!=='All')q.category=req.query.category;
 if(req.query.maxPrice)q.price={$lte:Math.max(0,Number(req.query.maxPrice)||0)};
 if(req.query.q)q.$or=[{name:{$regex:String(req.query.q).slice(0,60),$options:'i'}},{category:{$regex:String(req.query.q).slice(0,40),$options:'i'}}];
 let rooms=await Room.find(q).sort({price:1}).lean();
 if(req.query.checkIn&&req.query.checkOut&&new Date(req.query.checkOut)>new Date(req.query.checkIn)){
   const overlaps=await Booking.find({status:{$in:['Confirmed','Checked-in']},checkIn:{$lt:new Date(req.query.checkOut)},checkOut:{$gt:new Date(req.query.checkIn)}}).select('room').lean();
   const busy=new Set(overlaps.map(b=>String(b.room))); rooms=rooms.filter(r=>!busy.has(String(r._id)));
 }
 res.json({rooms});
}catch(e){next(e)}});
router.get('/:id',async(req,res,next)=>{try{const room=await Room.findOne({_id:req.params.id,active:true});if(!room)return res.status(404).json({message:'Room not found.'});res.json({room})}catch(e){next(e)}});
router.post('/',protect,allow('admin'),async(req,res,next)=>{try{const {name,category,price,capacity,description,size,beds,image}=req.body;if(!name||!['Standard','Deluxe','Suite'].includes(category)||!Number.isFinite(Number(price))||Number(price)<0)return res.status(400).json({message:'Valid name, category and price are required.'});const room=await Room.create({name,category,price:Number(price),capacity:Number(capacity)||2,description,size,beds,image});res.status(201).json({room})}catch(e){next(e)}});
router.patch('/:id',protect,allow('admin','staff'),async(req,res,next)=>{try{const allowed=['name','category','description','price','capacity','size','beds','image','status','active'];const patch={};for(const k of allowed)if(req.body[k]!==undefined)patch[k]=req.body[k];const room=await Room.findByIdAndUpdate(req.params.id,patch,{new:true,runValidators:true});if(!room)return res.status(404).json({message:'Room not found.'});res.json({room})}catch(e){next(e)}});
export default router;
