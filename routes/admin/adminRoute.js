// const tokenVerification = require('../../core/middlewares/adminTokenVerify');
const express = require('express');
const router = express.Router();


const tokenVerification = require("../../core/middlewares/adminTokenVerify");
const categoryController = require("../../controllers/admin/cat.controller");
const adminController = require("../../controllers/admin/admin.controller");
const productController = require("../../controllers/admin/prod.controller");
// const supportController = require("../../controllers/admin/support.controller");
const multer = require('multer');
var storage = multer.diskStorage({
    destination: 'public/images',
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
var upload = multer({ storage: storage });
console.log('categoryName');

router.post("/signin", adminController.signin);
router.post("/signup", adminController.signup);
// -------------------------------------------------------------------------------------
router.post("/addCategory",tokenVerification.varifyToken, upload.single('catImage'), categoryController.addCategory);
router.get("/ViewCategory",tokenVerification.varifyToken, categoryController.getCategory);
router.post("/deleteCategory",tokenVerification.varifyToken, categoryController.deleteCategory);
router.post("/updateCategory",tokenVerification.varifyToken, upload.single('catImage'), categoryController.updateCategory);
//--------------------------------------------------------------------------------------

router.post("/addProduct",tokenVerification.varifyToken, upload.single('prodImage'), productController.addProduct);
router.get("/ViewProduct",tokenVerification.varifyToken, productController.getProduct);
router.get("/ViewProductByCAtegory",tokenVerification.varifyToken, productController.getProductByCategory);
router.post("/deleteProduct",tokenVerification.varifyToken, productController.deleteProduct);
router.post("/updateProduct",tokenVerification.varifyToken, upload.single('prodImage'), productController.updateProduct);
//--------------------------------------------------------------------------------------
// router.post("/support", supportController.support);
// router.post("/query", supportController.query);
module.exports = router;