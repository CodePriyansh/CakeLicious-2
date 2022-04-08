const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        min: 10,
        max: 10
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: 4
    },
    address1: {
        type: String
    },
    profilePic: {
        type: String,
        trim: true
    },
    location: {
        type: String,
    },
    bio: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date('August 19, 1975 23:15:30 GMT+05:30')
    },
    updatedAt: {
        type: Date,
        default: Date('August 19, 1975 23:15:30 GMT+05:30'),
    },
    otp: {
        type: String
    }
})

module.exports = mongoose.model('customer', customerSchema)