const Hashpassward = require('bcrypt')

const Encrypted = async({password})=>{
    const res = await Hashpassward.hash(password , 10)
    return res ;
}

const Hashotp = async({value})=>{
    const res = await Hashpassward.hash(value , 10)
    return res 
}


module.exports = {Encrypted , Hashotp}