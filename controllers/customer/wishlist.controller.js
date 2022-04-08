const Wishlist = require('../../models/customer/wishlist.model')

exports.AddToWishlist = async (request, response) => {
    const customerId = request.customer._id
    console.log("Customer Id: ", customerId)
    var check = await Wishlist.findOne({ customer: customerId});
    console.log("Wishlist.findOne check: "+check)
    const wishlistId = request.body.wishlistItems
    console.log('Wishlist Items: ', wishlistId)
    
    if(!check){
        check = new Wishlist({
            customer: customerId
        })
    }
    check.wishlistItems.push(wishlistId)
    await check.save()
    .then(result => {
         console.log("Check save: "+result);
         return response.status(200).json(result)
     }).catch(err => {
         console.log(err);
         return response.status(200).json(err)
     })
}


exports.ViewWishlist = async (request, response) => {
    const customerId = request.customer._id
    await Wishlist.findOne({customer: customerId}).populate('wishListItems').exec()
    .then(result => {
        return response.status(200).json(result)
    })
    .catch(error => {
        return response.status(500).json({msg: "error in wishlist view "})
    })
}

exports.DeleteWishlistItem = async (request, response) => {
    const {itemId} = request.params
    const customerId = request.customer._id
    console.log("Customer Id from token: " + customerId)
    await Wishlist.updateOne({customer: customerId},
        {
            $pullAll:
            {
            wishlistItems: [itemId]
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

exports.DeleteWishlist = async (request, response) => {
    await Wishlist.deleteMany({_id: request.params.wishlistId})
    .then(result => {
        return response.status(200).json({msg: "wishlist Cleared."})
    })
    .catch(err => {
        return response.status(500).json({ msg: "Could not clear"})
    })
}