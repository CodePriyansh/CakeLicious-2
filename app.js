const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://CodePriyanshu786:pathak123@mucluster.utw9l.mongodb.net/CakeLicious?retryWrites=true&w=majority")
const cors = require('cors')
app.use(cors())
const port = process.env.PORT || 8080

// const cache = require('route-cache')

const adminRoute = require('./routes/admin/adminRoute')
const customerRoute = require('./routes/customer/customerRoute')
const indexRoute = require('./routes/index')


app.use(express.json({limit : '50MB'}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//Base route for Admin
app.use('/admin', adminRoute)
// app.use('/admin', cache.cacheSeconds(20), adminRoute)
app.use('/index',indexRoute)
//Base route for Customer
app.use('/customer', customerRoute)

app.listen(port,() =>{
    console.log("Server is running on port: ", port)
})