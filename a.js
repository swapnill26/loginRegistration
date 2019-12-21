app.post('/login',(req,res)=>{
    const email=req.body.email;
    const pass=req.body.pass;
    
    users.find({email:email},(err,FoundEmail)=>{
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


app.post('/register',(req,res)=>{
    const email=req.body.email;
    User.findOne({email:email},(err,Found)=>{
        if(err){
            console.log(err);
        }else{
            if(Found){
               return req.flash('message','user alredy exist');
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
                        newUser.save((err,user)=>{
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

app.post('/register',async (req,res)=>{
    try{
        const hashedPassword=bcrypt.hashSync(req.body.password,10);
        users.push({
            id:Date.now().toString(),
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword
        });
        res.redirect('/login');
    }catch {
        res.redirect('/register');
    }
    console.log(users);
});

mongoose.connect( "mongodb+srv://swap:swap14@cluster0-obbnb.mongodb.net/registerdb",{useNewUrlParser:true,useUnifiedTopology: true},(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('connected to Db');
    }
});

app.post('/register',(req,res)=>{    
    const email=req.body.email;
    User.findOne({email:email},(err,Found)=>{
    if(err){
        console.log(err);
    }else{
        if(Found){
           return req.flash('message','user alredy exist');
        }else{
            const hashedPassword=bcrypt.hashSync(req.body.password,10);                             
              const  newUser=new User({
                    fname:req.body.fname,
                    mname:req.body.mname,
                    lname:req.body.lname,
                    address:req.body.address,
                    zip:req.body.zip,
                    phno:req.body.phno,
                    education:req.body.education,
                    email:req.body.email,
                    password:hashedPassword
                    });    
                    newUser.save((err,user)=>{
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