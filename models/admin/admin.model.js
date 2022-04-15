const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password : {
        type: String,
        require: true,
        min: 4
    },
})

module.exports = mongoose.model('admin', adminSchema)