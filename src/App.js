const express = require('express')
const App = express()
const Connectdb = require('./config/Database')

App.get('/' , (req , res)=>{
    res.send('Hello from Home')
})

Connectdb().then(()=>{
    console.log('Connection is success');
    App.listen(3000 , ()=>{
    console.log('Server is listening');
})
})