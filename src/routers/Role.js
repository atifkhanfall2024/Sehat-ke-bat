const express = require('express')
const RoleSelect = express.Router()
const VerifyAuth = require('../middleware/VerifyAuth')
const RoleBased = require('../models/Role')
const { findById } = require('../models/user')


RoleSelect.post('/roles/verify' ,VerifyAuth , async(req,res)=>{
   try{
        const {role , documents} = req.body
        const userid = req.user._id
        
         let status ;
   if (["Doctor", "Healthcare_worker", "Lab", "Pharmacy", "Ambulance_driver"].includes(role)) {
      status = "pending";
} else {
   status = "approved";
} 



const RoleModel = new RoleBased({
   role ,
   status,
   documents,
   Userid:userid
})

// also check that if the login user is already presnet in database then he cannot be send request again

const findUser = await RoleBased.findOne({Userid:req.user._id})
if(findUser){
   return res.status(401).json({message:'Role Already Assign to User'})
}

await RoleModel.save()

  res.send('Verfication is in ' + status)
   }catch(err){
      res.status(401).send(err.message)

   }
})

module.exports = RoleSelect