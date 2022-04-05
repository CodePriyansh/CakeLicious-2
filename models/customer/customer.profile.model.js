const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer"
    },
    address1: {
        type: String
    },
    address2: {
        type: String
    },
    address3: {
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
    updatedAt: {
        type: Date,
    }
})

module.exports = mongoose.model('profile', profileSchema)