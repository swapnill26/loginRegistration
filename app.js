const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const session=require('express-session');
const passport=require('passport');
const flash=require('express-flash');
const bcrypt=require('bcryptjs');
//const User=require('./model/userSchema');


const initializePassport=require('./passport-config');
initializePassport(
    passport,
    email => users.find( user => user.email === email),
    id=> users.find( user => user.id === id)
    );

const app=express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(flash());
app.use(session({    
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false  
}));

app.use(passport.initialize());
app.use(passport.session());

const users=[];

app.get('/login',(req, res) => {
    res.render('login.ejs');
});

app.get('/register',(req,res)=>{
    res.render('register.ejs');
});

app.get('/',(req,res)=>{
    res.render('home.ejs');
});

app.get('/show',checkAuthenticated,(req,res)=>{
    res.render('show.ejs',{us:req.user});
});

app.post('/login',passport.authenticate('local',{
    successRedirect:'/show',
    failureRedirect:'/login',
    failureFlash:true
}));


app.post('/register',async (req,res)=>{
    try{
        const hashedPassword=bcrypt.hashSync(req.body.password,10);
        users.push({
            id:Date.now().toString(),
            fname:req.body.fname,
            mname:req.body.mname,
            lname:req.body.lname,
            address:req.body.address,
            zip:req.body.zip,
            education:req.body.education,
            email:req.body.email,
            password:hashedPassword
        });
        res.redirect('/login');
    }catch {
        res.redirect('/register');
    }
    console.log(users);
});

app.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/login');
});

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}
function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated){
        res.redirect('/show');
    }
    next();
}

app.listen(process.env.PORT,()=>{
    console.log("running on post 3000")
});