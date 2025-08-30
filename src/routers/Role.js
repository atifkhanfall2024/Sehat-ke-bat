const express = require('express')
const RoleSelect = express.Router()
const VerifyAuth = require('../middleware/VerifyAuth')
const RoleBased = require('../models/Role')
const multer = require('multer')
const upload = multer({ dest: "uploads/" });




RoleSelect.post('/roles/verify' ,VerifyAuth ,  upload.single("documents"), async(req,res)=>{
   try{
        const role = req.body.role
        const userid = req.user._id

        //console.log("File received:", req.file);
       //console.log("Body received:", req.body);

       
         let status ;
   if (["Doctor", "Healthcare_worker", "Lab", "Pharmacy", "Ambulance_driver"].includes(role)) {
      status = "pending";
}else if(["Patient"].includes(role)){
   status = "approved";
} else{
return res.status(401).json({
      message:"unautorizaed role"
   })
}

  let documents = [];
      if (req.file) {
        const publicUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        documents.push(publicUrl);
      } else if (req.body.documents) {
        documents = [req.body.documents]; // fallback if you send URL directly
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

        return res.status(201).json({
        message: `Verification is in ${status}`,
        data: RoleModel,
      });
   }catch(err){
      res.status(401).send(err.message)

   }
})

module.exports = RoleSelect