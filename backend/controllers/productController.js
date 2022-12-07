const Product = require("../models/Product");

exports.getAllProducts = async function (req, res) {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    });
}

// Admin route
exports.createProduct = async function (req, res, next) {
    const product = await Product.create(req.body);
    // if (!product) return res.status(400).json({ message: "Product not created!" });

    res.status(201).json({
        success: true,
        product
    })

}

// update a product - Admin Route
exports.updateProduct = async function (req, res, next) {
    // first check if the product exists the product.
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(400).json({
        success: false,
        message: "Product not found!"
    })

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

}

// delete a product -- Admin route
exports.deleteProduct = async function (req, res, next) {
    // check if the product exists or not.
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(400).json({
        success: false,
        message: "No such product exists!"
    });

    await product.remove();
    res.status(200).json({
        success: true,
        message: "Deleted Successfully!"
    });
}
