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