const express = require("express");
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');
const { processPayment ,verifyPayment} = require("../controllers/paymentcontrollers");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
dotenv.config({path:"server/config/config.env"})

const router= express.Router();


router.route("/process").post(processPayment)
router.route("/verify").post(verifyPayment)
module.exports=router;