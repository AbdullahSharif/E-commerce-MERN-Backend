const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, "Address is required!"]
        },
        city: {
            type: String,
            required: [true, "City is required!"]
        },
        state: {
            type: String,
            required: [true, "State is required!"]
        },
        postalCode: {
            type: Number,
            required: [true, "Postal code is required!"]
        },
        country: {
            type: String,
            required: [true, "Country is required!"]
        },
        phoneNumber: {
            type: Number,
            required: true
        }
    },
    orderItems: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        Image: {
            type: String,
            required: true
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true
        }
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    paidAt: {
        type: Date,
        required: true,
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing",
    },
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("Order", orderSchema);