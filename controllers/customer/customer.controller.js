const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
require('dotenv').config()


let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})


const Customer = require('../../models/customer/customer.model')

exports.Signup = async (request,response)=>{
    const { name, email, mobile, password } = request.body
    const hash = await bcrypt.hash(password, 12)
    let otp = otpGenerator.generate(6, { specialChars: false })
    let oldCustomer = await Customer.findOne({email: email, mobile: mobile})
    console.log("Old Customer: ", oldCustomer)
    if(!oldCustomer){
        const result = await Customer.create({
            name: name,
            email: email,
            password: hash,
            mobile: mobile,
            otp: otp,
            address1: "",
            address2: "",
            address3: "",
            profilePic: "",
            location: "",
            bio: ""
        })
        if(result){
            let mailDetails = {
                from: '"CakeLicious 🎂" <geekhunters001@gmail.com>', // sender address
                to: result.email, // list of receivers
                subject: "Email verification!", // Subject line
                html: "<b>Congratulations " + result.name + "! Your account has been created successfully on</b>" +
                    "<h3><a href='localhost:4200'>CakeLicious</a></h3>" +
                    " <b>Your otp is: " + otp + " Click on the <a href='localhost:8080/customer/verify-email'>link</a>" +
                    " and enter the Given otp there to activate your account.</b>" +
                    "<b><br><br><br>Regards<br><h5>CakeLicious 🎂</h5></b>"
            }
            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log('Error Occurs')
                } else {
                    console.log('Email sent successfully')
                }
            })
            return response.status(200).json({ msg: "Congratulations :" + result.name + ", Your account has been created successfully, Please activate your account." })
        }
        else {
            return response.status(500).json(error)
        }
    }
    else {
        return response.status(500).json({error: "This email is already assigned with another account, Please try another one!"})
    }
}

exports.verifyEmail = async (request, response) => {
    let result = await Customer.findOne({ email: request.body.email })
        if (result) {
            console.log("Database OTP: " + result.otp)
            if (result.otp === request.body.otp) {
                Customer.updateOne({
                    email: request.body.email
                },
                    {
                        $set: {
                            status: true,
                            otp: ""
                        }
                    })
                    .then(result => {
                        console.log("UpdateOne Result: " + result)
                        return response.status(200).json({ msg: "Your account has been activated successfully." })
                    })
                    .catch(err => {
                        console.log("Error in IF OTP: " + err)
                        return response.status(500).json({ err })
                    })
            }
            else {
                return response.status(500).json({ msg: "Invalid OTP, Please try again." })
            }
        }
        else {
            console.log("Error in outer catch: ", err)
            return response.status(500).json({ msg: "Invalid Email." })
        }
}

exports.Signin = async (request,response)=>{
    const { email, password } = request.body
    const result = await Customer.findOne({email: email})
    console.log("Result of login: ", result)
    if(result) {
        if(result.status){
            const match = await bcrypt.compare(password, result.password)
            console.log("Bcrypt: ", match)
            if(match){
                const token = jwt.sign(
                    {
                        customer:
                        {
                            _id: result._id,
                            email: result.email,
                            name: result.name
                    }
                   },
                   process.env.TOKEN_KEY,
                   {
                       expiresIn: "5D",
                   }
                )
                console.log("Token: ",token)
                return  response.status(200).json({ msg: "Welcome " + result.name + "! Your token is: " + token })
            }
        }
    }
    else {
        return  response.status(500).json({error: "Email is invalid!"})
    }
}

exports.Profile = async (request, response)=> { // get the id from JWT token later
    const { address1, address2, address3, location, bio } = request.body
    try{
    const result = await updateOne({customer: request.customer._id},
        {
            $set: {
                address1: address1,
                profilePic: "url" + request.file.filename,
                location: location,
                bio: bio,
                updatedAt: Date.now()
            }
        }
        )
        if(result){
            console.log("Result details from updateProfile Model: ", result)
            return response.status(200).json({success: "Profile updated successfully!"})
        }
    }
    catch(err){
        console.log("error in catch: ",err)
        return response.status(500).json({msg: "Something went wrong! Please check your details", error: err})
    }
}