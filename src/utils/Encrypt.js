const Hashpassward = require('bcrypt')

const Encrypted = async({password})=>{
    const res = await Hashpassward.hash(password , 10)
    return res ;
}

module.exports = {Encrypted}