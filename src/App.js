const express = require('express')
const app = express()
const Connectdb = require('./config/Database')
const AuthRoute = require('./routers/Auth')
const parser = require('cookie-parser')
const Role = require('./routers/Role')
app.use(parser())
app.use(express.json())
app.use('/' , AuthRoute)
app.use('/' , Role)


Connectdb().then(()=>{
    console.log('Connection is success');
    app.listen(3000 , ()=>{
    console.log('Server is listening');
})
})