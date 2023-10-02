const Product = require("../models/product");
exports.updatestock=async (id,quantity)=>{
     
    const product =await Product.findById(id);

   
    
    product.stock=product.stock-quantity;
    await product.save({validateBeforeSave:false});
}
   

  
   
  