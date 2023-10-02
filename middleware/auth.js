const User=require('../models/user');
const  jwt =require('jsonwebtoken');

const { Errormiddleware } = require("./asyncerror");
exports.isAuthenticatedUser= Errormiddleware(async (req,res,next)=>{
  const authHeader = req.headers['authorization'];
    if(!authHeader){
        return res.status(401).json({error:"please login first"})
    }
    const token = authHeader.split(' ')[1];
    
    const decodeddata=jwt.verify(token,process.env.JWT_SECRET);
    req.user=await User.findById(decodeddata.id);
   
  

    next();
}) 
exports.authorizedRoles=Errormiddleware((req,res,next)=>{
    if(req.user.role!=='admin'){
        return res.status(403).json({error:"you are not authorized"})
    }
    next();


})

