const { Errormiddleware } = require("../middleware/asyncerror");
const instance =require('../server')
const crypto = require('crypto');
const ErrorHandler = require("../utils/errorhandler");

const Razorpay = require("razorpay");


exports.processPayment= Errormiddleware(async(req,res,next)=>{
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });
    const options = {
        amount:Number(req.body.amount*100),  // amount in the smallest currency unit
        currency: "INR",
       
      
       
      };
  
   await  instance.orders.create(options,function(err,order){
    if(err){
      console.log(err)
      return next(new ErrorHandler(err.message,500))
    }
    else{
  res.status(200).json({success:true,order,key:process.env.RAZORPAY_API_KEY})
     
    }
  })
 




})


//verify payment

exports.verifyPayment=Errormiddleware(async(req,res,next)=>{

  const { razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature }=req.body;

  const secret = process.env.RAZORPAY_API_SECRET; // Replace with your actual Razorpay secret key

    // Construct the message to be signed
    const message = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Create an HMAC hex digest using SHA256
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex');

    // Compare the generated signature with the received signature
    if (generated_signature === razorpay_signature) {
      // Payment is successful
      res.status(200).json({ status: 'Payment verified successfully' ,success:true});

    }
      
   
     else {
      // Payment verification failed
      res.status(400).json({ status: 'Payment verification failed' });
    }
}
)