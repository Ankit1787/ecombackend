const express= require('express')
const { getallproducts ,createproduct,updateproduct,deleteproduct,singleproduct, review, createreview, deletereview, getallreviews, deletereviewadmin, test, getproductname, setproducts, setproduct, } = require('../controllers/productcontroller')
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth')
const router=express.Router()
 



router.route("/products").get(getallproducts)
router.route("/admin/products/new").post(isAuthenticatedUser,createproduct)
router.route("/admin/products/:id").put(isAuthenticatedUser,authorizedRoles,updateproduct).delete(isAuthenticatedUser,authorizedRoles,deleteproduct)
router.route("/product/:id").get(singleproduct)

//create and update review
router.route("/product/review").put(isAuthenticatedUser,createreview)
//delete review
router.route("/product/review").delete(isAuthenticatedUser,deletereview)
//delete review -- Admin
router.route("/admin/product/review").delete(isAuthenticatedUser,authorizedRoles,deletereviewadmin)
//get all review---Admin

router.route("/admin/reviews/:id").get(isAuthenticatedUser,authorizedRoles,getallreviews)

router.route("/setproduct").post(setproduct)

module.exports = router