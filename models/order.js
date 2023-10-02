const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippinginfo: {
    addressline1: {
      type: String,
      required: true,
    },
    addressline2: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    name:{
      type:String,
      required:true
    }
  },
  orderitems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
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
      _id: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
   
  },
  paymentinfo: {
    id: {
      type: String,
      required: true,
      unique:true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
  
  },
  itemprice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxprice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingprice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalprice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderstatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  deliveredAt: Date,

  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("order", orderSchema);
