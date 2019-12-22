const  express=require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const session=require('express-session')
const flash=require('express-flash');
const User=require('./model/userSchema');
const passport=require('passport');
const localStratergy=require('passport-local').Strategy;

const app=express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

app.use(flash());
app.use(session({    
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false  
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStratergy({
    usernameField:'email',
    passwordField:'password',
    },
function(username,password,done){
    User.findOne({email:username},(err,user)=>{
        if(err){
            return done(err);
        }
        if(!user){
            return done(null,false,{message:'user not found'});
        }
        if(!bcrypt.compareSync(password,user.password)){
            return done(null, false, { message: 'Incorrect password.' })
        }
        return done(null,user);
    })
  }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

mongoose.connect('mongodb://localhost:27017/userdb', {useNewUrlParser: true,useUnifiedTopology: true},()=>{
    console.log('connected to db');
});

app.get('/signup',(req,res)=>{
    res.render('register.ejs');
});

app.get('/',(req,res)=>{
    res.render('home.ejs');
});

app.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/');
 });

app.get('/show',checkAuthenticated,(req,res)=>{
     res.render('show.ejs',{us:req.user});
});

app.get('/login',(req,res)=>{
    res.render('login.ejs'); 
 });

app.post('/login',  passport.authenticate('local',{
    successRedirect: '/show',
    failureRedirect: '/login',
    failureFlash: true 
}));

app.get('/signup',(req,res)=>{
    res.render('register.ejs');
});

app.post('/signup',(req,res)=>{

    const hashPassword=bcrypt.hashSync(req.body.password, 10);

    const newUser=new User({
        name:req.body.name,
        address:req.body.address,
        zip:req.body.zip,
        phno:req.body.phno,
        email:req.body.email,
        password:hashPassword
    });
    newUser.save((err)=>{
        if(!err){            
            res.redirect('/login');
        }else{
            console.log(err);
        }
    });
    
});

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}


app.listen(3000,()=>{
    console.log('running on port 3000')
})