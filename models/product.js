const mongoose = require('mongoose')

const prodSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true,"please enter product name"],
    trim:true,unique:true
},
description:{
    type:String,
    required:[true,"please enter  product description"],
   
},
price:{
    type:Number,
    required:[true,"please enter product price"],
    maxLength:[8,"price cannot exceed 8 character"]
},
rating:{
    type:Number,
    default:0
},
images:[
  {  public_id:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }}
],
category:{
    type:String,
    required:[true,'please enter product category'],
    
},
stock:{
    type:Number,
    required:true,
    default:1
},
numofreviews:{
    type:Number,
    required:true,
    default:0
},
reviews:[
    {
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"user",
            required:true,
        },
        name:{
            type:String,
            required:true
         
        },
        rating:{
            type:Number,
            required:true
         
        },
        Comment:{
            type:String,
            required:true
         
        },
    }
],
createdAt:{
    type:Date,
    default:Date.now()
}

});

module.exports = mongoose.model("product",prodSchema)