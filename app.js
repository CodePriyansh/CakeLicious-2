const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const ejs = require('ejs')
mongoose.connect("mongodb+srv://CodePriyanshu786:pathak123@mucluster.utw9l.mongodb.net/CakeLicious?retryWrites=true&w=majority")
const cors = require('cors')
const helmet = require('helmet')
const hpp = require('hpp')

app.use(cors())
const port = process.env.PORT || 8080

// const cache = require('route-cache')

const adminRoute = require('./routes/admin/adminRoute')
const customerRoute = require('./routes/customer/customerRoute')
const indexRoute = require('./routes/index')

//Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
app.use(helmet())
app.set('view engine', 'ejs');
app.use(express.json({limit : '50MB'}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended: true}))

//HPP puts array parameters in req.query and/or req.body aside and just selects the last parameter value. You add the middleware and you are done.
app.use(hpp())

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