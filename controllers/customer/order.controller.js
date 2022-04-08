const Order = require('../../models/customer/order.model')

exports.PlaceOrder = async (request, response) => {
    const { cartId, name, mobile, address} = request.body;
    const customer = request.customer._id
    let cartItems = await Cart.findOne({customer: customer}).populate('dishItems')
    let cartDetail = cartItems.dishItems
    const order = {cartId, name, mobile, address, customer}
    console.log(cartDetail)
    // await Order.findOne({ customer: customer})
    let check = new Order(order)
    for(let i=0; i < request.body.paymentMethod.length; i++){
        check.paymentMethod.push({
            mode: request.body.paymentMethod[i].mode,
            transactionId: request.body.paymentMethod[i].transactionId
        })
        check.orderItems.push(
            cartDetail
        )
    }
        await check.save()
        .then(result => {
         console.log("Check save: "+result)
         return response.status(200).json(result)
     }).catch(err => {
         console.log(err);
         return response.status(200).json(err)
     })
}