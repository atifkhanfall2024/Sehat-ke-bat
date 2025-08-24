const express = require('express')
const app = express()
const Connectdb = require('./config/Database')
const User = require('./models/user')
const {Encrypted} = require('./utils/Encrypt')

app.use(express.json())
app.post('/signup' , async(req,res)=>{

     try{
           // first we need to recieve datafrom body 
    const {fullName , email , password , role ,phoneNumber } = req.body

    // now we need to secure our passward also mean covert into hash
      
     const hashPassward = await Encrypted({password})
     //console.log(hashPassward);

    const user = new User({
     fullName ,
     email ,
     password:hashPassward ,
     role,
     phoneNumber
     
    })
     await user.save()
     // generate otp
     
     res.status(201).send('Signup Successfully')
     }catch(err){
        console.log(err.message);
        res.status(401).json({message:err.message})
     }
})

Connectdb().then(()=>{
    console.log('Connection is success');
    app.listen(3000 , ()=>{
    console.log('Server is listening');
})
})