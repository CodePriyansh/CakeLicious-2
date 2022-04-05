const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    catName : {
        type: String,
        require: true
    },
    catImage : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('category', categorySchema)