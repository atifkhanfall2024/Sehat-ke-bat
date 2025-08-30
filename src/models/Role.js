const mongoose = require('mongoose')

const RoleBased = new mongoose.Schema({
    Userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
      role: {
    type: String,
    enum: ['Patient', 'Doctor', 'Healthcare Worker', 'Lab', 'Pharmacy', 'Ambulance Driver'],
    message:`{VALUE} is incorrect type` ,
    default: 'Patient',
  },
      status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  documents: [{ type: String }],
   
})

module.exports = mongoose.model('Role' , RoleBased)