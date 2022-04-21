//customerRoute

const express = require('express')
const router = express.Router();
const { request } = require('express');

const Product = require('../../models/admin/prod.model');
const Support = require('../../models/admin/admin.support.model');
const customerController = require('../../controllers/customer/customer.controller')
const cartController = require('../../controllers/customer/cart.controller')
const wishlistController = require('../../controllers/customer/wishlist.controller')
const orderController = require('../../controllers/customer/order.controller')

const auth = require('../../core/middlewares/userTokenVerify')

const Razorpay = require('razorpay')
var instance = new Razorpay({ key_id: 'rzp_test_zG2UPfGE20QkVD', key_secret: '3xujWy2PWJ9TsCRJrtMUXUt7' })

const multer = require('multer')

let storage = multer.diskStorage({
    destination: 'public/customer/media',
    filename: (request, file, callback) => {
        callback(null, "profile" + Date.now() + "_" + file.originalname)
    }
})

let upload = multer({storage: storage})


router.post('/order',(req,res)=>
 {
     console.log(req.body)
    instance.orders.create({
        amount:100,
        currency: "INR",
        receipt: "receipt#1"
      },(err,order)=>{
          console.log(order)
          res.json(order)
      })
 })


 router.post("/order-status",(req,res)=>{

    instance.payments.fetch(req.body.razorpay_payment_id).then(paymentDetail=>{
        console.log(paymentDetail)
        // res.json(paymentDetail)

        res.render("success.ejs",{
            result:paymentDetail
        })
    })


 })



router.post('/sign-up', customerController.Signup)
router.post('/login', customerController.login)
router.post('/signup', customerController.signup)

router.get('/verify-email/:id', customerController.verifyEmail)
router.get('/getProduct', customerController.getProduct)
router.post('/getProductById', customerController.getProductById)

router.post('/verify-email-resend', customerController.resendVerifyEmail)

router.post('/reset-password', customerController.resetPassword)

router.post('/verify-otp/:id', customerController.verifyOTP)

router.post('/sign-in',customerController.Signin)

router.get('/view-all-products', auth.verifytoken, (request,response)=>{
  Product.find().then((result)=>{
              return response.status(200).json(result)
  }).catch((error)=>{
         return response.status(500).json(error)
  })
})

router.get('/view-prod-by-category', (request,response)=>{
      
    Product.find({category:request.body._id}).then((result)=>{
          return response.status(200).json(result)
    }).catch((error)=>{
          return response.status(500).json(error)
    })
})  

router.post('/search-product', (request,response)=>{

    Product.find({prodName:{$regex:req.body.name,$options:'$i'}}).then((result)=>{
          return response.status(200).json(result)
    }).catch((error)=>{
       return response.status(500).json(error)
    })
})


router.post('/customer-query', auth.verifytoken, (request,response)=>{
     Support.create(request.body).then((result)=>{
         return response.status(200).json(result);
     }).catch((error)=>{
          return response.status(500).json(error);
     })
})

router.post('/profile', auth.verifytoken, upload.single("profilePic"), customerController.Profile)

router.post('/add-to-card', auth.verifytoken, cartController.AddToCart)

router.post('/view-cart', auth.verifytoken, cartController.ViewCart)

router.post('/delete-cart-item/:itemId', auth.verifytoken, cartController.DeleteCartItem)

router.post('/delete-cart', auth.verifytoken, cartController.DeleteCart)

router.post('/add-to-wishlist', auth.verifytoken, wishlistController.AddToWishlist)

router.post('/view-wishlist', auth.verifytoken, wishlistController.ViewWishlist)

router.post('/delete-wishlist-item/:itemId', auth.verifytoken, wishlistController.DeleteWishlistItem)

router.post('/delete-wishlist', auth.verifytoken, wishlistController.DeleteWishlist)

router.post('/place-order', auth.verifytoken, orderController.PlaceOrder)

// router.post('/view-orders', auth, orderController.ViewOrder)


module.exports = router;