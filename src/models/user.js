const mongoose = require('mongoose')
const validator = require('validator')




const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error('Email Format is Invalid ' + value)
        }
    }
  },
  password: {   
    type: String,
    required: true,
    minlength: 6,
    validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error('Passward Should be strong')
        }
    }
  },
phoneNumber: {
  type: String,
  trim: true,
  validate: {
    validator: function(v) {
      // Matches +923XXXXXXXXX or 03XXXXXXXXX
      return /^((\+92)|(0))3[0-9]{9}$/.test(v);
    },
    message: props => `${props.value} is not a valid Pakistani phone number!`
  },
  required: [true, "Phone number is required"]
},
  role: { 
    type: String,
    enum: ['Patient', 'Doctor', 'Healthcare Worker', 'Lab', 'Pharmacy', 'Ambulance Driver'],
    message:`{VALUE} is incorrect type` ,
    default: 'Patient',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
   otp: String,
  otpExpiry: Date,
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
