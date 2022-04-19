const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')

const auth = require('../../core/middlewares/userTokenVerify')
require('dotenv').config()

const domain = "http://localhost:8080"

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})


const Customer = require('../../models/customer/customer.model')
const Product = require('../../models/admin/prod.model')

exports.Signup = async (request, response) => {
    const { name, email, mobile, password } = request.body
    const hash = await bcrypt.hash(password, 12)
    // let verifyToken = otpGenerator.generate(50, { specialChars: true })
    let oldCustomer = await Customer.findOne({ email: email, mobile: mobile })
    console.log("Old Customer: ", oldCustomer)
    if (!oldCustomer) {
        const result = await Customer.create({
            name: name,
            email: email,
            password: hash,
            mobile: mobile,
            address1: "",
            profilePic: "",
            location: "",
            bio: ""
        })
        if (result) {
            let verifyEmailToken = jwt.sign(
                {
                    emailVerification:
                    {
                        _id: result._id,
                        email: result.email
                    }
                },
                process.env.EMAIL_TOKEN_KEY,
                {
                    expiresIn: "24H",
                }
            )
            let link = domain + '/customer/verify-email/' + verifyEmailToken
            let mailDetails = {
                from: process.env.EMAIL, // sender address
                to: result.email, // list of receivers
                subject: "Email verification!", // Subject line
                html: "<b>Congratulations " + result.name + "! Your account has been created successfully on</b>" +
                    "<h3><a href='http://localhost:4200'>CakeLicious</a></h3>" +
                    " <b>This link will be expired within 24 Hours," +
                    " Please Click on the <a href=" + link + ">Link</a> to verify your email to activate your account.</b>" +
                    "<b><br><br><br>Regards<br><h5>CakeLicious 🎂</h5></b>"
            }
            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log('Error Occurs')
                    console.log(err)
                } else {
                    console.log('Email sent successfully')
                }
            })
            return response.status(200).json({ msg: "Congratulations :" + result.name + ", Your account has been created successfully, Please check your inbox to activate your account." })
        }
        else {
            return response.status(500).json(error)
        }
    }
    else {
        return response.status(500).json({ error: "This email is already assigned with another account, Please try another one!" })
    }
}

exports.resendVerifyEmail = async (request, response) => {
    const email = request.body.email
    const result = await Customer.findOne({ email: email })
    if (result) {
        let verifyEmailToken = jwt.sign(
            {
                emailVerification:
                {
                    _id: result._id,
                    email: result.email
                }
            },
            process.env.EMAIL_TOKEN_KEY,
            {
                expiresIn: "24H",
            }
        )
        let link = domain + '/customer/verify-email/' + verifyEmailToken
        let mailDetails = {
            from: '"CakeLicious 🎂" <process.env.EMAIL>', // sender address
            to: result.email, // list of receivers
            subject: "Email verification!", // Subject line
            html: "<b>Dear " + result.name + "! Email verification link has been sent via email, Please check your inbox!</b>" +
                "<h3><a href='http://localhost:4200'>CakeLicious</a></h3>" +
                " <b>This link will be expired within 24 Hours," +
                " Please Click on the <a href=" + link + ">Link</a> to verify your email to activate your account.</b>" +
                "<b><br><br><br>Regards</b><br><h4>CakeLicious 🎂</h4>"
        }
        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log('Error Occurs in email sending')
                console.log(err)
            } else {
                console.log('Email sent successfully')
            }
        })
        return response.status(200).json({ msg: "Email verification link has been sent via email, Please check your inbox!" })
    }
    else {
        return response.status(500).json({ msg: "No account found, please check email address or try another one!" })
    }
}

exports.Signin = async (request, response) => {
    const { email, password } = request.body
    const result = await Customer.findOne({ email: email })
    console.log("Result of login: ", result)
    if (result) {
        if (result.status) {
            const match = await bcrypt.compare(password, result.password)
            console.log("Bcrypt: ", match)
            if (match) {
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
                result.token = token
                console.log("Token: ", token)
                return response.status(200).json({ msg: "Welcome " + result.name + "! Your token is: " + token })
            }
            else {
                return response.status(500).json({msg: "Invalid Password."})
            }
        }
    }
    else {
        return response.status(500).json({ error: "Email is invalid!" })
    }
}

exports.verifyEmail = async (request, response) => {
    console.log("starts")
    let paramsToken = request.params.id
    console.log(paramsToken)
    let decoded = jwt.verify(paramsToken, process.env.EMAIL_TOKEN_KEY)
    console.log(decoded)

    request.verifyEmailToken = decoded
    console.log(request.verifyEmailToken)

    const tokenDecoded = request.verifyEmailToken.emailVerification
    console.log(tokenDecoded)

    console.log("Verify email ka console with request: " + tokenDecoded._id)
    Customer.updateOne({
        _id: tokenDecoded._id
    },
        {
            $set: {
                status: true
            }
        })
        .then(result => {
            console.log("UpdateOne Result: " + result)
            return response.status(200).json({ msg: "Your account has been activated successfully." })
        })
        .catch(err => {
            console.log("Error in IF OTP: " + err)
            return response.status(500).json({ error: err })
        })
}

exports.resetPassword = async (request, response) => {
    const { email } = request.body
    const result = await Customer.findOne({ email: email })
    if (result) {
        let link = domain + '/customer/verify-otp/' + result._id
        let otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
        let mailDetails = {
            from: '"CakeLicious 🎂" <process.env.EMAIL>', // sender address
            to: result.email, // list of receivers
            subject: "Email verification!", // Subject line
            html: "<b>Dear " + result.name + "!</b>" +
                " Here is the 6 digits OTP: " + otp + " click on the <a href=" + link + ">Link</a> and enter OTP to reset your password.</b>" +
                "<b><br><br><br>Regards</b><br><h4>CakeLicious 🎂</h4>"
        }
        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log('Error Occurs in email sending')
                console.log(err)
            } else {
                console.log('Email sent successfully')
            }
        })
        const updateResult = await Customer.updateOne({ email: result.email }, {
            $set: {
                otp: otp
            }
        })
        return response.status(200).json({msg: "OTP sent successfully!"})
    }
    else {
        return response.status(500).json({ error: "No account found, please check email address of try another one!" })
    }
}

exports.verifyOTP = async (request, response) => {
    let id = request.params.id
    let otp = request.body.otp
    let result = await Customer.findOne({ _id: id })
    console.log("verify findOne: "+ result)
    if (result) {
        console.log("Database OTP: " + result.otp)
        if (result.otp === otp) {
            let hash = await bcrypt.hash(request.body.password, 12)
            let resultUpdate = await Customer.updateOne({ _id: id }, { $set: { password: hash, otp: "", updatedAt: Date.now() } })
            console.log(resultUpdate)
            if (resultUpdate.matchedCount) {
                return response.status(200).json({ msg: "Your Password has been updated successfully." })
            }
            else {
                return response.status(500).json({ msg: "error" })
            }
        }
        else {
            return response.status(500).json({ msg: "Invalid OTP, Please try again." })
        }
    }
    else {
        return response.status(500).json({ msg: "Invalid Email." })
    }
}

exports.Profile = async (request, response) => { // get the id from JWT token later
    const { address1, location, bio, name } = request.body
    let token = request.customer.customer // access all the properties of the token which is provided at the time of SignIn (token._id, token.email, token.name)
    console.log("profile id: "+ token._id)
    console.log("profile email: "+ token.email)
    try {
         const result = await Customer.updateOne({ _id: token._id },
            {
                $set: {
                    name: name,
                    address1: address1,
                    profilePic: "url" + request.file.filename,
                    location: location,
                    bio: bio,
                    updatedAt: Date.now()
                }
            }
        )
        if (result.modifiedCount) {
            return response.status(200).json({ success: "Profile updated successfully!" })
        }
        else {
            return response.status(500).json({error: "Something went wrong, Profile not updated.", result: result})
        }
    }
    catch (err) {
        return response.status(500).json({ msg: "Something went wrong! Please check your details", error: err })
    }
}


exports.getProduct = (request, response) => {
    Product.find().
    then(results => {
            return response.status(200).json(results);
        })
        .catch(err => {
            return response.status(500).json({ message: 'Sever Error' });
        });
}

exports.getProduct = (request, response) => {
    Product.find({_id:request.body.id}).
    then(results => {
            return response.status(200).json(results);
        })
        .catch(err => {
            return response.status(500).json({ message: 'Sever Error' });
        });
}
