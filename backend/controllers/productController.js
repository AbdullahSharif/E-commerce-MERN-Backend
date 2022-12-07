const Product = require("../models/Product");
const ErrorHandler = require("../utils/errorHandler");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

exports.getAllProducts = async function (req, res, next) {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            products
        });

    } catch (exc) {
        next(new ErrorHandler(exc.message, 500));
    }

}

exports.getProductDetails = async function (req, res, next) {
    // check whether the product exists.
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product not found!", 400));

    // if the product exists then,
    return res.status(200).json({
        success: true,
        product
    })

}

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
