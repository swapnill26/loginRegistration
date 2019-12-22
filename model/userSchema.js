const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:String,
    address:String,
    zip:Number,
    phno:Number,
    education:String,
    email:String,
    password:String
});

const User=mongoose.model('user',userSchema);

module.exports=User;