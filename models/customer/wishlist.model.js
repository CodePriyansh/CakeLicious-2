const mongoose = require('mongoose')

const wishListSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer'
    },
    wishListItems: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
    }]
})

module.exports = mongoose.model('wishlist', wishListSchema)