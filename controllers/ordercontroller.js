const Order = require("../models/order");

const { Errormiddleware } = require("../middleware/asyncerror");
const ErrorHandler = require("../utils/errorhandler");
const { updatestock } = require("../utils/updatestatus");
exports.createOrder = Errormiddleware(async (req, res, next) => {
 
  const {

    shippinginfo,
    orderitems,
    paymentinfo,
    itemprice,
    taxprice,
    shippingprice,
    totalprice,
  } = req.body;
shippinginfo.name=shippinginfo.firstname + " " +shippinginfo.lastname; 

  const orderData = {
    shippinginfo,
    orderitems,
    paymentinfo,
    itemprice,
    taxprice,
    shippingprice,
    totalprice,
    user: req.user.id,
    paidAt: Date.now(),
  };

  const order = await Order.create(orderData);
  order.orderitems.forEach(async (item) => {
    
    await updatestock(item._id, item.quantity,next);
  });

  if (!order) {
    return next(new ErrorHandler("order not created"));
  }
  res.status(201).json({
    sucess: true,
    order,
  });
});
// get single order
exports.getsingleorder = Errormiddleware(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("order not found", 404));
  }
  res.status(200).json({
    sucess: true,
    order,
  });
});

//get all orders --Admin
exports.getallorders = Errormiddleware(async (req, res, next) => {
  const orders = await Order.find({}).populate("user", "name  email");

  if (!orders) {
    return next(new ErrorHandler("orders not found", 404));
  }
  const totalamount = orders.reduce((acc, curr) => {
    acc += curr.totalprice;

    return acc;
  }, 0);

  res.status(200).json({ succes: true, orders, totalamount });
});

//get all order ---User

exports.getallordersuser = Errormiddleware(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).populate(
    "user",
    "name email"
  );
  if (!orders) {
    return next(new ErrorHandler("orders not found", 404));
  }
  res.status(200).json({ succes: true, orders });
});

//update order status ---Admin

exports.updateorderstatus = Errormiddleware(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if(!order){
    return next(new ErrorHandler("order not found", 404));
  }
  if (order.orderstatus === "delivered") {
    return next(new ErrorHandler("order already delivered", 404));
  }
  order.orderitems.forEach(async (item) => {
    
    await updatestock(item.Product, item.quantity,next);
  });

  order.orderstatus = req.body.status;
  if (req.body.status === "delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, order });
});

//delete order ---Admin

exports.deleteorder = Errormiddleware(async (req, res, next) => {

  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new ErrorHandler("order not found", 404));
  }
  res.status(200).json({ success: true, order });

})
