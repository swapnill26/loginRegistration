
const LocalStrategy=require('passport-local').Strategy; 
const bcrypt=require('bcryptjs');

function initialize(passport,getUserByEmail,getUserById){
    const authenticateUser=(email,password,done)=>{
        const user=getUserByEmail(email);
        if(user == null){
            return done(null,false,{ message: 'user not found' });
        }
        try{
            if(bcrypt.compareSync(password, user.password)){
                return done(null,user);
            }else{
                return done(null,false,{ message : 'password incorrect' });
            }
        }catch(e){
            return done(e);
        }
    }
    passport.use(new LocalStrategy({usernameField:'email'},authenticateUser));
    passport.serializeUser((user,done)=> done(null,user.id));
    passport.deserializeUser((id,done)=> done(null,getUserById(id)));
}

module.exports=initialize;
