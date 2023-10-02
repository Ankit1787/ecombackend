const express =require("express")
const app =express()
const cors =require("cors")
const cookie = require('cookie');
const fileupload=require('express-fileupload')
const path=require('path')
const session = require('express-session');
const bodyParser=require('body-parser')
const errormiddleware = require('./middleware/error')
const cookieParser = require('cookie-parser');

if(process.env.NODE_ENV!=="PRODUCTION"){
    require('dotenv').config()
}
app.use(express.json())
app.use(fileupload())
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser())

// middleware for errors 
app.use(cors({
    credentials: true,origin: 'http://localhost:3000'
}));

// Set the cookie in the response headers


app.use('/api/v2/' ,require('./routes/productroute.js'))

//user route
app.use('/api/v2/user' ,require('./routes/userroute'))

//order route
app.use('/api/v2' ,require('./routes/orderroute'))

//paymentrouutes
app.use('/api/v2/payment' ,require('./routes/paymentroutes'))

//middleware for errors 

app.use(errormiddleware)
module.exports =app

// Code snippet from c:\Users\anshu\bootstrap\TinDog Start Here\Ecom\server\models\order.js
// const mongoose = require("mongoose");
// 
// const orderSchema = new mongoose.Schema({
//   shipinginfo: {
//     address: {
//       type: String,
//       required: true
//     },
//     city: {
//       type: String,
//       required: true
//     },
//     state: {
//       type: String,
//       required: true
//     },
//     country: {
//       type: String,
//       required: true
//     },
//     pincode: {
//       type: Number,
//       required: true
//     },
//     phoneno: {
//       type: Number,
//       required: true
//     },
//     orderitems: [
app.use(errormiddleware)
module.exports =app
