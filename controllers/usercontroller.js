const { Errormiddleware } = require("../middleware/asyncerror");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../models/user"); //importing user model
const sendToken = require("../utils/jwttoken");
const  sendEmail=require("../utils/sendEmail");

const crypto=require("crypto");
const cloudinary =require('cloudinary')

//Register a user
exports.createuser= Errormiddleware(async (req, res, next) => {
  const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
    folder:"avatars",
    width:500,
  
    crop:"scale"
    
  }) 
 const id= await myCloud.public_id;
const imgurl=  await myCloud.secure_url;
    const { name, email, password } = req.body;
    const UserData={
      name,
      email,
      password,
      avatar:{
     
        public_id:id,
        url:imgurl
      } 
    }
    const user = await User.create(UserData);
    sendToken(user,201,res)

})
exports.login= Errormiddleware(async (req, res, next) => {
  const { email, password } = req.body;
  if(email && password){
    const user = await User.findOne({email}).select("+password");
    
    if(!user){
      return next(new ErrorHandler("invalid email or password",401));
    }
     const isPasswordMatched=await user.comparePassword(password);
     if(!isPasswordMatched){
      return next(new ErrorHandler("invalid email or password",401));
     }
    sendToken(user,200,res)
     
  }

  else{
    return next(new ErrorHandler("please enter email and password",401));
  
  }
})

exports.logout= Errormiddleware(async (req, res, next) => {
  res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true
  })
  res.status(200).json({
    success:true,
    message:"logged out"
  })

})
//forgot password

exports.forgotpassword= Errormiddleware(async (req, res, next) => {
  const user = await User.findOne({email:req.body.email});
  if(!user){
    return next(new ErrorHandler("user not found",404));
  }
  const resetToken=user.getResetPasswordToken();
  await user.save({validateBeforeSave:false});
  const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/user/password/reset/${resetToken}`;
  const message=`your password reset token is :- \n\n ${resetPasswordUrl}\n\n if you have not requested this email then please ignore it`;
  try{
  const result=  await sendEmail({
      email:user.email,
      subject:"Ecommerce password recovery",
      message
    })
   
    
    res.status(200).json({
      success:true,
      message:`email sent to ${user.email} successfully`
    })
  }
  catch(error){
    user.resetpasswordtoken=undefined;
    user.resetpasswordExpire=undefined;
    await user.save({validateBeforeSave:false})}
  })


  //reset password
  exports.resetpassword= Errormiddleware(async (req, res, next) => {
    //creating token hash
    const normalizedToken = req.params.token.trim();

    const resetpasswordtoken=crypto.createHash("sha256").update(normalizedToken).digest("hex");
                                                                                                                                                                                                                                                                                                   
    //finding user by token
    const user = await User.findOne({
      resetpasswordtoken,
      resetpasswordExpire:{ $gt: Date.now() }
  })

    
   
    if(!user){
      return next(new ErrorHandler("reset      password token is invalid or has been expired",400));
    }
    if(req.body.password!==req.body.confirmPassword){
      return next(new ErrorHandler("password does not match",400));
    }

     user.password=req.body.password;
     user.resetpasswordExpire=undefined;
     user.resetpasswordtoken=undefined;

     await user.save();

     res.status(200).json({
    success:true,
    user})
   

  
  });
  //get user details

  exports.getuserdetails= Errormiddleware(async (req, res, next) => {
     
   const user= await User.findById(req.user.id);

  res.status(200).json({
    success:true,
    user})
   
  })

  //update password 
  exports.updatepassword= Errormiddleware(async (req, res, next) => {
    const user=await User.findById(req.user.id).select("+password");
    const isPasswordMatched=await user.comparePassword(req.body.oldpassword);
    if(!isPasswordMatched){
      return next(new ErrorHandler("old password is incorrect",400));
    }
    if(req.body.newpassword!==req.body.confirmPassword){
      return next(new ErrorHandler("password does not match",400));
    }
    user.password=req.body.newpassword;
    await user.save();
    sendToken(user,200,res)
  
  })

  //update user profile

  exports.updateuserprofile= Errormiddleware(async (req, res, next) => {
    
   
     
    const { name, email } = req.body;
    const newUserData={
      name,
      email, 
    }
    // const user = await User.findById(req.user.id);
    //   const imageid=user.avatar.public_id;
    // if(req.body.user!==imageid){
     
    //   await cloudinary.v2.uploader.destroy(imageid);
      const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
    folder:"avatars",
    width:500,
  
    crop:"scale"
    
  }) 
      newUserData.avatar={
        public_id:myCloud.public_id,
        url:myCloud.secure_url
    }
    
   
 
  
    const response=await User.findByIdAndUpdate(req.user.id,newUserData,{
      new:true,
      runValidators:true,
      useFindAndModify:false
    })
    res.status(200).json({
      success:true
    })
    

   
  })
    

  //get all users --Admin

  exports.getallusers= Errormiddleware(async (req, res, next) => {
    const users=await User.find({});

    if(!users){
      return next(new ErrorHandler("no users found",400));
    }
    res.status(200).json({
      success:true,
      users
  })

})

//get single user --Admin

exports.getsingleuser= Errormiddleware(async (req, res, next) => {

  const user=await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler("no details found",400));
  }

  res.status(200).json({
    success:true,
    user
  })

})

//update user role --Admin



exports.updateuserrole= Errormiddleware(async (req, res, next) => {
    
  const newUserData={
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  }
  const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false
  })
  res.status(200).json({
    success:true
  })
})

//delete user --Admin

exports.deleteuser= Errormiddleware(async (req, res, next) => {

  const user=await User.findByIdAndDelete(req.params.id);

  if(!user){
    return next(new ErrorHandler("no user found",400));
  }

  res.status(200).json({
    success:true,
    user
  })

})



  
    

  


    
   
  
  