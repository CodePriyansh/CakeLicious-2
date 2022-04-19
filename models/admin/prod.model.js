const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    prodName: {
        type: String,
        required: true
    },
    prodImage: {
        type: String,
        required: true
    },
    prodPrice: {
        type: Number,
        required: true
    },
    prodDescription: {
        type: String
    },
    flavour:{
        type: String
    },
    prodReview: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order'
    }]
})

module.exports = mongoose.model('product', productSchema)