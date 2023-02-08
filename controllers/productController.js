const Product = require('../models/productModel');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


// create product  -- Admin route

exports.createProduct = catchAsyncErrors(async (req, res) => {

    const product = await Product.create(req.body);

    return res.status(201).json({
        success: true,
        product
    })
})

exports.getAllProducts = async (req, res) => {
    const products = await Product.find();
    return res.status(200).json({
        success: true,
        products
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