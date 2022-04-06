const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    mobile: {
        type: String,
        trim: true,
        min: 10,
        max: 10
    },
    address: {
        type: String,
    },
    paymentMethod: {
        mode: {
            type: String,
            default:"cash on delivery"
        },
        transactionId: {
            type: String
        }
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer'
    },
    orderedItem: [
        {
            ProductId: {
                type: Schema.Types.ObjectId,
                ref: 'product'
            }
            ,
            Qty: {
                type: Number,
                default: 1
            }
        }
    ],
    orderedAt: {
        type: Date,
        default: Date('August 19, 1975 23:15:30 GMT+05:30')
    },
    orderStatus: {
        type: String
    }
})

module.exports = mongoose.model("orders", orderSchema)