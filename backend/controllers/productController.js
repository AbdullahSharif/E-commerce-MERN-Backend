const Product = require("../models/Product");
const ErrorHandler = require("../utils/errorHandler");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const Features = require("../utils/Features");


exports.getAllProducts = asyncErrorHandler(async function (req, res, next) {
    const resultsPerPage = 5;
    const productCount = await Product.countDocuments();
    const searchFeature = new Features(Product.find(), req.query).search().filter().pagination(resultsPerPage);
    const products = await searchFeature.query;
    res.status(200).json({
        success: true,
        products,
        productCount: productCount
    });

})

exports.getProductDetails = asyncErrorHandler(async function (req, res, next) {
    // check whether the product exists.

    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product not found!", 400));

    // if the product exists then,
    return res.status(200).json({
        success: true,
        product
    })

})

// try-catch approach
// // Admin route
// exports.createProduct = async function (req, res, next) {
//     try {
//         const product = await Product.create(req.body);
//         return res.status(201).json({
//             success: true,
//             product
//         })
//     } catch (exc) {
//         return next(new ErrorHandler("Product not created!", 500));

//     }

// }

// now if we create an async handler function, then:
exports.createProduct = asyncErrorHandler(async (req, res) => {
    const product = await Product.create(req.body);
    return res.status(201).json({
        success: true,
        product
    })
})

// update a product - Admin Route
exports.updateProduct = asyncErrorHandler(async function (req, res, next) {
    // first check if the product exists the product.
    let product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product not found!", 400));


    // if the product is found then update it.
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        product
    });

})

// delete a product -- Admin route
exports.deleteProduct = asyncErrorHandler(async function (req, res, next) {
    // check if the product exists or not.
    const product = await Product.findById(req.params.id);

    if (!product) return next(new ErrorHandler("No such product exits!", 400));


    await product.remove();


    res.status(200).json({
        success: true,
        message: "Deleted Successfully!"
    });
})


exports.createOrUpdateReview = asyncErrorHandler(async (req, res, next) => {
    const { rating, comment } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating,
        comment
    }

    // find the product in the database.
    const product = await Product.findById(req.body.productId);

    if (!product) { return next(new ErrorHandler("Product not found!", 404)) }

    const isReviewed = product.reviews.find(rev => rev.user.toString() == req.user._id.toString());

    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() == req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach(rev => avg += rev.rating)
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    return res.status(200).json({
        success: true
    })


})

// get all product reviews.
exports.getAllProductReviews = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) { return next(new ErrorHandler("Product not found!", 404)) }

    return res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// delete review.
exports.deleteReview = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) { return next(new ErrorHandler("No such product exists!", 404)) }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

    let avg = 0;
    reviews.forEach(rev => avg += rev.rating);

    const ratings = avg / reviews.length;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings, numOfReviews }, { new: true, runValidators: true, useFindAndModify: false });

    return res.status(201).json({
        success: true,
        message: "Review Deleted!"
    })


})