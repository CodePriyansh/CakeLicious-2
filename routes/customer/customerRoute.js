//customerRoute

const express = require('express')
const router = express.Router();
const User = require('../../models/customer/customer.model')
const Product = require('../../models/admin/prod.model');
const Support = require('../../models/customer/support.model');
const { request } = require('express');
router.post('/sign-up',(request,response)=>{

     User.create(request.body).then((result)=>{
         return response.status(200).json(result)
     }).catch((error)=>{
         return response.status(500).json(error)
     })

})

router.post('/sign-in',(request,response)=>{

    User.find({email:request.body.email,password:request.body.password}).then((result)=>{
               return  response.status(200).json(result)
    }).catch((error)=>{
        return  response.status(500).json(error)

    })
})

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


module.exports = router;

