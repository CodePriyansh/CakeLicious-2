const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer'
    },
    cartItems: [{
            type:String,
            ref: 'product'
    }]
})

module.exports = mongoose.model('cart', cartSchema)