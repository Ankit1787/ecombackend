const mongoose = require("mongoose");
const validator=require("validator");
const bcrypt =require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv=require("dotenv");
const crypto =require("crypto");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your name"],
        maxlength:[30,"name cannot exceed 30 characters"],
        minlength:[4,"name should have more than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:true,
        validate:[validator.isEmail,"please enter valid email"]
    },
    password:{
        type:String,
        required:[true,"please enter your password"],
        maxlength:[30,"password cannot exceed 30 characters"],
        minlength:[8,"password should have more than 4 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetpasswordtoken:String,
    resetpasswordExpire:Date
    
    
});
//password hashing
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    
    
    this.password=await bcrypt.hash(this.password,10);
})

//jwt token
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })

}
//Compare password
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
    
}

//reset password

userSchema.methods.getResetPasswordToken=function(){
    //generate token
    const resetToken=crypto.randomBytes(20).toString("hex");
    //hash and set to resetpasswordtoken
    this.resetpasswordtoken=crypto.createHash("sha256").update(resetToken).digest("hex");
    //set expi
    this.resetpasswordExpire=Date.now()+15*60*1000
    return resetToken;

}
module.exports=mongoose.model("user",userSchema);

