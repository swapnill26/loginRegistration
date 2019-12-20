const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
var cookieParser = require('cookie-parser');
const session=require('express-session');

const app=express();

app.use(express.static('public'));
app.set('view engine','hbs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));


mongoose.connect('mongodb://localhost:27017/userdb',{useNewUrlParser:true,useUnifiedTopology: true},(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('connected to Db');
    }
});


const  userSchema=mongoose.Schema({
    fname:String,
    mname:String,
    lname:String,
    address:String,
    zip:Number,
    phno:Number,
    education:String,
    email:String,
    pass:String
});

const User=mongoose.model('User',userSchema);

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register',(req,res)=>{
    res.render('register');
});

app.get('/',(req,res)=>{
    res.render('home');
});



app.get('/logout', (req, res) => {
   
        res.render('login');
});

app.post('/register',(req,res)=>{
    const email=req.body.email;
    User.findOne({email:email},(err,Found)=>{
        if(err){
            console.log(err);
        }else{
            if(Found){
                res.send('user alredy exist');
            }else{
                             
                  const  newUser=new User({
                        fname:req.body.fname,
                        mname:req.body.mname,
                        lname:req.body.lname,
                        address:req.body.address,
                        zip:req.body.zip,
                        phno:req.body.phno,
                        education:req.body.education,
                        email:req.body.email,
                        pass:req.body.pass
                        });    
                        newUser.save((err)=>{
                        if(!err){
                           
                            res.render('login');
                        }else{
                            res.send(err);
                        }
                      });

            }
        }
      
    });
}); 

app.post('/login',(req,res)=>{
    const email=req.body.email;
    const pass=req.body.pass;
    
    User.findOne({email:email},(err,FoundEmail)=>{
        if(err){
            res.redirect('/login');
        }else{
            if(FoundEmail){
               if(FoundEmail.pass===pass){                    
                    res.render('show',{data:FoundEmail});
                }else{
                    res.send('incorrect password');
                }
            }
        }
    });
});




app.listen(3000,()=>{
    console.log("running on post 3000")
});