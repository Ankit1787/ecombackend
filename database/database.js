 const mongoose = require('mongoose')
const Product = require('../models/product')

 const dotenv =require('dotenv')
 dotenv.config({path:"config/config.env"})

const dburl =process.env.mongoUrl;

 const dbconnect = async()=>{
    
      await mongoose.connect(dburl,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(()=>{
        console.log('database connect')
      })
     
 }
 
module.exports = dbconnect;
 