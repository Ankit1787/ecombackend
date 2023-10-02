const express = require("express");
const { createOrder, getsingleorder, getallorders, getallordersuser, updateorderstatus, deleteorder }= require("../controllers/ordercontroller");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");
const router = express.Router();

//create order
router.route("/orders/new").post(isAuthenticatedUser,createOrder)


//get single order
router.route("/order/:id").get(getsingleorder)

//get all orders ---user
router.route("/me/orders").get(isAuthenticatedUser,getallordersuser)

//get all orders ---admin
router.route("/admin/orders").get(isAuthenticatedUser,authorizedRoles,getallorders)

//update order status ---admin //delete order ---admin
router.route("/admin/order/:id").put(isAuthenticatedUser,authorizedRoles,updateorderstatus).delete(isAuthenticatedUser,authorizedRoles,deleteorder)





module.exports = router;