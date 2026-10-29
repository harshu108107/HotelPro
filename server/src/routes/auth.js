import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models.js';
import { protect } from '../middleware/auth.js';
const router = Router();
const safeUser = u => ({ id: u._id, name: u.name, email: u.email, role: u.role, phone: u.phone });
router.post('/register', async (req,res,next) => {
  try {
    const name = String(req.body.name || '').trim(), email = String(req.body.email || '').trim().toLowerCase(), password = String(req.body.password || '');
    if (name.length < 2 || name.length > 80) return res.status(400).json({message:'Name must be between 2 and 80 characters.'});
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({message:'Enter a valid email address.'});
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return res.status(400).json({message:'Password must be at least 8 characters and contain a letter and a number.'});
    if (await User.exists({email})) return res.status(409).json({message:'An account with this email already exists.'});
    const user = await User.create({name,email,password:await bcrypt.hash(password,12),role:'guest'});
    const token = jwt.sign({sub:user._id,role:user.role},process.env.JWT_SECRET || 'dev-only-change-me',{expiresIn:process.env.JWT_EXPIRES_IN || '1d'});
    res.status(201).json({token,user:safeUser(user)});
  } catch(e){ if(e.code===11000)return res.status(409).json({message:'Email already registered.'}); next(e); }
});
router.post('/login', async (req,res,next) => {
  try {
    const email=String(req.body.email||'').trim().toLowerCase(), password=String(req.body.password||'');
    const user=await User.findOne({email}).select('+password');
    if(!user || !user.active || !(await bcrypt.compare(password,user.password))) return res.status(401).json({message:'Invalid email or password.'});
    const token=jwt.sign({sub:user._id,role:user.role},process.env.JWT_SECRET || 'dev-only-change-me',{expiresIn:process.env.JWT_EXPIRES_IN || '1d'});
    res.json({token,user:safeUser(user)});
  } catch(e){next(e);}
});
router.get('/me',protect,(req,res)=>res.json({user:safeUser(req.user)}));
router.patch('/me',protect,async(req,res,next)=>{try{
 const patch={}; if(typeof req.body.name==='string'&&req.body.name.trim().length>=2)patch.name=req.body.name.trim().slice(0,80);
 if(typeof req.body.phone==='string')patch.phone=req.body.phone.trim().slice(0,25);
 const u=await User.findByIdAndUpdate(req.user._id,patch,{new:true});res.json({user:safeUser(u)});
}catch(e){next(e)}});
export default router;
