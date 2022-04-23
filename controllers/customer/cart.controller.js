const Cart = require('../../models/customer/cart.model')

exports.AddToCart = async (request, response) => {
    const customerId = request.body.Userid
    console.log("Customer Id: ", customerId)
    var check = await Cart.findOne({ customer: customerId});
    console.log("Cart.findOne check: "+check)
    const prodId = request.body.id
    console.log('Cart Items: ', prodId)
    
    if(!check){
        check = new Cart({
            customer: customerId
        })
    }

   
            check.cartItems.push(prodId)
            await check.save()
            .then(result => {
                 console.log("Check save: "+result);
                 return response.status(200).json({result:result,status:'ok'})
             }).catch(err => {
                 console.log(err);
                 return response.status(200).json(err)
             })
    }
    



exports.ViewCart = async (request, response) => {
    const customerId = request.body.userId
    console.log(customerId)
    await Cart.findOne({customer: customerId}).populate('cartItems').exec()
    .then(result => {
        return response.status(200).json(result)
    })
    .catch(error => {
        return response.status(500).json({msg: "error in cart view "})
    })
}

exports.DeleteCartItem = async (request, response) => {
    
    const customerId = request.body.userId
    const id = request.body.id
    console.log("Customer Id from token: " + customerId)
    await Cart.updateOne({customer: customerId},
        {
            $pullAll:
            {
            cartItems: [id]
        }
})
    .then(result => {
        console.log(result)
        return response.status(200).json({result})
    })
    .catch(error => {
        console.log("error in catch ",error)
        return response.status(500).json({msg: "Could not delete item"})
    })
}

exports.DeleteCart = async (request, response) => {
    await Cart.deleteMany({_id: request.params.cartId})
    .then(result => {
        return response.status(200).json({msg: "Cart Cleared."})
    })
    .catch(err => {
        return response.status(500).json({ msg: "Could not clear"})
    })
}