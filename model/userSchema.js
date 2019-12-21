const mongoose=require('mongoose');

const  userSchema=mongoose.Schema({
    fname:String,
    mname:String,
    lname:String,
    address:String,
    zip:Number,
    phno:Number,
    education:String,
    email:String,
    password:String
});

const User=mongoose.model('User',userSchema);

module.exports=User;