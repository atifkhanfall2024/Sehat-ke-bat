const express = require('express')
const app = express()
const AuthRoute = express.Router()
const User = require('../models/user')
const {Encrypted} = require('../utils/Encrypt')
const {Hashotp} = require('../utils/Encrypt')
const nodemailer = require("nodemailer");
const Hashpassward = require('bcrypt')
const jwt = require('jsonwebtoken')
const VerifyAuth = require('../middleware/VerifyAuth')


app.use(express.json())


AuthRoute.post('/signup' , async(req,res)=>{

     try{
    const {fullName , email , password , role ,phoneNumber , status } = req.body 
   
     const hashPassward = await Encrypted({password})

       const otp = Math.floor(100000 + Math.random() * 900000);
       const value = otp.toString()

       const HashCode = await Hashotp({value})
       const user = new User({
     fullName ,
     email ,
     password:hashPassward ,
     role,
     phoneNumber,
     otp:HashCode ,
     documents,
     status ,
    otpExpires: Date.now() + 1 * 60 * 1000 
    })

    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,       
    pass: process.env.EMAIL_PASS   
  }
});

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: email, 
      subject: "Email Verification OTP",
      text: `Your OTP code is ${otp}. It is valid for 1 minutes.`,
    };
     await transporter.sendMail(mailOptions);
        await user.save()
     res.status(201).send('OTP Send to your email for verification')
     }catch(err){
        console.log(err.message);
        res.status(401).json({message:err.message})
     }
  
     
})

AuthRoute.post('/otp/verify' , async(req,res)=>{
    try{
        const {email , otp} = req.body

        const findUser = await User.findOne({email:email})
        if(!findUser){
            return res.status(404).send('User Not Found')
        }

         // verify otp
        
       const Verify = await Hashpassward.compare(otp , findUser.otp)
       if(!Verify){
        return res.status(401).send('Invalid Credantials')
       }

     
    if (Date.now() > findUser.otpExpires) {
   return res.status(400).send("OTP Expired");
}

       findUser.isVerified = true
       findUser.otp = null

       await findUser.save()
     
        res.status(200).send('Verification is Success')

    }catch(err){
        console.log(err.message);
    }
})

AuthRoute.post('/login' , async(req,res)=>{
    try{
           
const {email , password} = req.body

// first validate the email 

const user = await User.findOne({email:email})
if(!user){
    return res.status(401).send('Invalid Credantials')
}



// token only send when passward and email both verify

const Passward = await Hashpassward.compare(password , user.password)
if(!Passward){
    return res.status(401).send('Invalid Credantials')
}

if(user.isVerified !== true){
     return res.status(401).send('Invalid Credantials . Please Verify Your Otp')
}
// now making jwt which will be wrap inside cookie
const token = await jwt.sign({id:user._id} ,process.env.private_key , {expiresIn:'1d'} )
// token will be expire with in hour
res.cookie('token' , token , { expires: new Date(Date.now() + 1 * 3600000)})
res.status(200).send(user.fullName + ' Login Successfully ')
    }catch(err){
        res.status(401).send(err.message)
    }
})

AuthRoute.post('/logout' ,VerifyAuth , async(req,res)=>{
    try{
          const user = req.user
        res.clearCookie('token').send(user.fullName + ' Logout SuccessFully')

    }catch(err){
        res.status(401).send(err.message)
    }
})
module.exports = AuthRoute
