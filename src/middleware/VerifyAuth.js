const express = require('express')
const Parser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const app = express()
require('dotenv').config()

app.use(express.json());
app.use(Parser());

const VerifyAuth = async(req,res,next)=>{

   try{
    
       const {token} = req.cookies
       if(!token){
        return res.status(401).send('UnAuthourized Token is not present')
       }

       // now verify this token also that this is from login user or not

       const verify = await jwt.verify(token , process.env.private_key)
      
       const user = await User.findById({_id:verify.id})
       

       if(!user){
          return res.status(404).send('User Not found')
       }

       req.user = user 
       next()

    
   }catch(err){
       res.status(401).send(err.message)
   }
}



module.exports = VerifyAuth