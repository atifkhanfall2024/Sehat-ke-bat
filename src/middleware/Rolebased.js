
const Rolebased = require('../models/Role')

const RoleVerification = (role)=>{
    return async(req,res,next)=>{

        //console.log(req.user._id);
     
        const findRole = await Rolebased.findOne({Userid:req.user._id})
        if(!findRole){
            throw new Error('Access Dined')
        }

        if(!role.includes(findRole.role)){
              return res.status(403).json({ message: "Role not Match" });
        }

          if (findRole.status !== "approved" && findRole.role !== "Patient") {
        return res.status(403).json({ message: "Role not approved yet" });
      }

        next()
    }
}



module.exports = RoleVerification