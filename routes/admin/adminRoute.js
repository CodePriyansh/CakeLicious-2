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
router.post("/addCategory", upload.single('catImage'), categoryController.addCategory);
router.get("/ViewCategory", categoryController.getCategory);
router.post("/deleteCategory", categoryController.deleteCategory);
router.post("/updateCategory", upload.single('catImage'), categoryController.updateCategory);
//--------------------------------------------------------------------------------------

router.post("/addProduct", upload.single('prodImage'), productController.addProduct);
router.get("/ViewProduct", productController.getProduct);
router.post("/deleteProduct", productController.deleteProduct);
router.post("/updateProduct", upload.single('prodImage'), productController.updateProduct);
//--------------------------------------------------------------------------------------
// router.post("/support", supportController.support);
// router.post("/query", supportController.query);
module.exports = router;