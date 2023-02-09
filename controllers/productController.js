const Product = require('../models/productModel');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require('../utils/apiFeatures');


// create product  -- Admin route

exports.createProduct = catchAsyncErrors(async (req, res) => {

    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    return res.status(201).json({
        success: true,
        product
    })
})

exports.getAllProducts = async (req, res) => {

    const resultsPerPage = 5;
    const productCount = await Product.countDocuments();
    // Basically, we will send the query of the data base and what we want to find.
    // General Synatx -> ApiFeatures(Query, Feature you want to apply).
    // Feature -> http://hostName/api/allRoutes/products/allProducts?Key=anything
    // so the thins after ? in the url will be the req.query object
    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultsPerPage);
    const products = await apiFeatures.query;
    return res.status(200).json({
        success: true,
        products,
        productCount
    })
}

// get a single product.
exports.getProductDetails = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404))

    }

    return res.status(200).json({
        success: true,
        product
    })
}

// update a product.

exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found!", 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
}

exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404))
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "product deleted successfully!"
    })

}