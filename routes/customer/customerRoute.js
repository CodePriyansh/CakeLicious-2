//customerRoute

const express = require('express')
const router = express.Router();
const Product = require('../../models/admin/prod.model');
const Support = require('../../models/admin/admin.support.model');
const customerController = require('../../controllers/customer/customer.controller')
const cartController = require('../../controllers/customer/cart.controller')
const wishlistController = require('../../controllers/customer/wishlist.controller')
const orderController = require('../../controllers/customer/order.controller')

const auth = require('../../core/middlewares/userTokenVerify')


const { request } = require('express');
const multer = require('multer')

let storage = multer.diskStorage({
    destination: 'public/customer/media',
    filename: (request, file, callback) => {
        callback(null, "profile" + Date.now() + "_" + file.originalname)
    }
})

let upload = multer({storage: storage})


router.post('/sign-up', customerController.Signup)

router.post('/verify-email', customerController.verifyEmail)

router.post('/sign-in',customerController.Signin)

router.get('/view-all-products',(request,response)=>{
  Product.find().then((result)=>{
              return response.status(200).json(result)
  }).catch((error)=>{
         return response.status(500).json(error)
  })
})

router.get('/view-prod-by-category',(request,response)=>{
      
    Product.find({category:request.body._id}).then((result)=>{
          return response.status(200).json(result)
    }).catch((error)=>{
          return response.status(500).json(error)
    })
})  

router.get('/search-product',(request,response)=>{

    Product.find({prodName:{$regex:req.body.name,$options:'$i'}}).then((result)=>{
          return response.status(200).json(result)
    }).catch((error)=>{
       return response.status(500).json(error)
    })
})


router.post('/customer-query',(request,response)=>{
      
     Support.create(request.body).then((result)=>{
         return response.status(200).json(result);
     }).catch((error)=>{
          return response.status(500).json(error);
     })
       
})

router.post('/profile', auth, upload.single("profilePic"), customerController.Profile)

router.post('/add-to-card', auth, cartController.AddToCart)

router.post('/view-cart', auth, cartController.ViewCart)

router.post('/delete-cart-item/:itemId', auth, cartController.DeleteCartItem)

router.post('/delete-cart', auth, cartController.DeleteCart)

router.post('/add-to-wishlist', auth, wishlistController.AddToWishlist)

router.post('/view-wishlist', auth, wishlistController.ViewWishlist)

router.post('/delete-wishlist-item/:itemId', auth, wishlistController.DeleteWishlistItem)

router.post('/delete-wishlist', auth, wishlistController.DeleteWishlist)

router.post('/place-order', auth, orderController.PlaceOrder)

// router.post('/view-orders', auth, orderController.ViewOrder)


module.exports = router;