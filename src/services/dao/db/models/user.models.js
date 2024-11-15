import mongoose from "mongoose";

const  userCollection = 'users';

const userShema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true } ,
    age: {type : Number},
    email: {type :String, unique :true, lowercase :true},
    password: {type:String,required:false},
    loggedBy: {type: String},
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' }, 
    role: { type: String, default: 'user' }
})

const userModel = mongoose.model(userCollection,userShema);

export default userModel;