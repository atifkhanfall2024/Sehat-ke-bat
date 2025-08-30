const express = require('express')
const Admin = express.Router()
const VerifyAuth = require('../middleware/VerifyAuth')
const RoleVerify  = require('../middleware/Rolebased')
const RoleModel = require('../models/Role')

Admin.get('/admin/role' , VerifyAuth , RoleVerify('Admin') , async(req,res)=>{

    try{

        // first i will find that give me all those persons who status is in pending

        const GetPending = await RoleModel.find({status:'pending'}).populate("Userid", "fullName photo");


        res.send(GetPending)
    }catch(err){}
})

Admin.post('/admin/verify/:id' , VerifyAuth , RoleVerify('Admin') , async(req,res)=>{

  try{
      // first it will pick status from frontend
    const {status} = req.body
   // console.log(status);
    const Allowstatus = ["rejected" , "approved"]

    // checkk that if allow status have this or not

    if(!Allowstatus.includes(status)){
      return res.status(403).json({message:'Status not Allow'})
    }

    // now check user with id if present or not

    const Find = await RoleModel.findOne({_id:req.params.id})

    if(!Find){
  return res.status(404).json({message:'User Not Found'})
    }

    // also set that a person cannot approve by itself

    if(req.user._id === Find.Userid){
          return res.status(403).json({message:'Cannot Verify yourself'})
    }

    Find.status = status
    Find.documents = null

    await Find.save()

    res.status(200).json({message:`Role ${status} successfully`})

  }catch(err){
      res.status(500).json({ message: err.message });
  }
})





module.exports = Admin