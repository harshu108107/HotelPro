import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Room } from './models.js';
await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro');
for (const u of [
 {name:'HotelPro Admin',email:'admin@hotelpro.demo',password:'Admin123!',role:'admin'},
 {name:'HotelPro Staff',email:'staff@hotelpro.demo',password:'Staff123!',role:'staff'},
 {name:'Demo Guest',email:'guest@hotelpro.demo',password:'Guest123!',role:'guest'}
]) await User.updateOne({email:u.email},{$set:{...u,password:await bcrypt.hash(u.password,12)}},{upsert:true});
const data=[
 ['Classic Comfort','Standard',2499,2,'24 m²','1 Queen Bed','photo-1611892440504-42a792e24d32'],
 ['Deluxe Garden Room','Deluxe',3999,2,'32 m²','1 King Bed','photo-1590490360182-c33d57733427'],
 ['Executive City View','Deluxe',4999,3,'38 m²','1 King Bed','photo-1611892440504-42a792e24d32'],
 ['Premium Family Suite','Suite',6499,4,'52 m²','2 Queen Beds','photo-1578683010236-d716f9a3f461'],
 ['Signature Luxury Suite','Suite',8999,3,'68 m²','1 King Bed','photo-1582719508461-905c673771fd'],
 ['Cozy Business Room','Standard',2999,2,'27 m²','1 Queen Bed','photo-1595576508898-0ad5c879a061']
];
for(const [name,category,price,capacity,size,beds,img] of data) await Room.updateOne({name},{$set:{name,category,price,capacity,size,beds,image:`https://images.unsplash.com/${img}?auto=format&fit=crop&w=900&q=80`,description:`Comfortable ${category.toLowerCase()} accommodation with thoughtful amenities.`,active:true}},{upsert:true});
console.log('Seed complete. Demo accounts created and rooms upserted.');
await mongoose.disconnect();
