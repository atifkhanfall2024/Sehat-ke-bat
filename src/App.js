const express = require('express')
const app = express()
const Connectdb = require('./config/Database')
const AuthRoute = require('./routers/Auth')
const parser = require('cookie-parser')

app.use(parser())
app.use(express.json())
app.use('/' , AuthRoute)


Connectdb().then(()=>{
    console.log('Connection is success');
    app.listen(3000 , ()=>{
    console.log('Server is listening');
})
})