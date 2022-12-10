const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

exports.createOrder = asyncErrorHandler(async (req, res, next) => {
    const { shippingInfo,
        orderItems,
        paymentInfo,
        paidAt,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    // create a new order.
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        paidAt,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        user: req.user._id
    })

    // save the order.
    return res.status(201).json({
        success: true,
        order
    })
});


// to get a single order.
exports.getSingleOrder = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) { return next(new ErrorHandler("No such order found!", 404)) }

    return res.status(200).json({
        success: true,
        order
    })
})

// to get all orders of logged in user.
exports.getAllOrdersOfLoggedIn = asyncErrorHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    if (!orders) { return next(new ErrorHandler("You have ordered nothing yet!", 404)) }

    return res.status(200).json({
        success: true,
        orders
    })
})

// to delete the order.
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) { return next(new ErrorHandler("No such product exists!", 404)) }

    // if order found.
    await order.remove();
    res.status(200).json({
        success: true,
        message: "Order deleted Successfully!"
    })
})

// get all orders -- Admin route
exports.getAllOrdersInDB = asyncErrorHandler(async (req, res, next) => {
    const orders = await Order.find();
    if (!orders) { return next(new ErrorHandler("NO orders found!", 404)) }
    let totalAmount = 0;
    orders.forEach(order => totalAmount += order.totalPrice);

    res.status(200).json({
        success: true,
        orders,
        totalAmount
    });
})

// update order status -- Admin route
exports.updateOrderStatus = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("Product not found!", 404));
    }
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    if (req.body.orderStatus === "shipped") {
        order.orderItems.forEach(async (orderItem) => {
            await updateStock(orderItem.product, orderItem.quantity);
        })
    }
    if (req.body.orderStatus === "Delivered") {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });

    return res.status(200).json({
        success: true,
        message: "Order status updated Successfully!"
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.quantity -= quantity;
    await product.save({ validateBeforeSave: false });
}

