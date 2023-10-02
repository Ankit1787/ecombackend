const Product = require("../models/product");
const { Errormiddleware } = require("../middleware/asyncerror");
const cloudinary = require('cloudinary')
const ErrorHandler = require("../utils/errorhandler");
const Apifeatures = require("../utils/apifeatures");
const User = require("../models/user");
// create product
exports.createproduct = Errormiddleware(async (req, res, next) => {
  
  const images = req.body.images; // Assuming the images are sent as an array

    const uploadedImages = [];

    for (const image of images) {
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "avatars",
        width: 500,
        crop: "scale"
      });

      uploadedImages.push({
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      });
    }
     
    req.body.images = uploadedImages;
    
    
   
  const product = await Product.create(req.body);
  if (!product) {
    return next(new ErrorHandler("Product not Created", 404));
  }
  res.status(200).json({ succes: true, product });
});

// update single product
exports.updateproduct = Errormiddleware(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindandModify: false,
  });
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({ success: true, product });
});
//delete single product
exports.deleteproduct = Errormiddleware(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
    message: `product ${req.params.id} delete successfuly`,
  });
});
//get all product
exports.getallproducts = Errormiddleware(async (req, res, next) => {

  const resultperpage = 10;
  
  const apifeatures = new Apifeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultperpage);
  const products = await apifeatures.query;
  const productcount = await Product.countDocuments();
  // console.log(products)
  if (products.length == 0) {
    res.status(404).json({ success: false, message: "products not found" });
  } else {
    res.status(200).json({ success: true, products, productcount,resultperpage });
  }
});
//get single product
exports.singleproduct = Errormiddleware(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({ success: true, product });
});

//create review and update review

exports.createreview = Errormiddleware(async (req, res, next) => {
  const { review,id } = req.body;
  
  const reviews = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(review.rating),
    Comment:review.Comment
  };
  const product = await Product.findById(id);
  const isreviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user.id.toString()
  );
  if (isreviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user.id.toString()) {
        rev.rating = review.rating;
        rev.Comment = review.Comment;
      }
    });
  } else {
    await product.reviews.push(reviews);
    product.numofreviews = product.reviews.length;
  }
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, product });
});

// delte review

exports.deletereview = Errormiddleware(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  const reviews = product.reviews.filter(
    (rev) => rev.user.toString() !== req.user.id.toString()
  );

  if (reviews.length === product.reviews.length) {
    return next(new ErrorHandler("review not found", 404));
  }

  const numofreviews = reviews.length;
  const rating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  const response = await Product.findByIdAndUpdate(
    req.query.id,
    { reviews, numofreviews, rating },
    { new: true, runValidators: true, useFindandModify: false }
  );

  res.status(200).json({ success: true, response });
});

//get all reviews
exports.getallreviews = Errormiddleware(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({ success: true, reviews: product.reviews });
});

// delete review admin
exports.deletereviewadmin = Errormiddleware(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  const reviews = product.reviews.filter(
    (rev) => rev.user.toString() !== req.query.userid.toString()
  );

  if (reviews.length === product.reviews.length) {
    return next(new ErrorHandler("review not found", 404));
  }

  const numofreviews = reviews.length;
  const rating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  const response = await Product.findByIdAndUpdate(
    req.query.id,
    { reviews, numofreviews, rating },
    { new: true, runValidators: true, useFindandModify: false }
  );

  res.status(200).json({ success: true, response });
});

exports.setproduct=Errormiddleware(async(req,res,next)=>{
  try {

    // Save each product in the productsDataArray
  

      // Create a new Product instance and save it to the database
      const product =  await Product.insertMany(req.body);
    
    

    res.status(200).json({ message: 'Products saved successfully' });
  } catch (error) {
    console.error('Error saving products:', error);
    res.status(500).json({ error: 'Error saving products' });
  }
})

