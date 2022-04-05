const mongoose = require('mongoose')

const supportSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        query: [{
            type: String
        }]
    },
})

module.exports = mongoose.model('support', supportSchema)