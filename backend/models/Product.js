const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        minlenght: [4, "Name must be atleast 4 characters long"],
        maxlength: [155, "Name can be a maximum of 155 characters! "],
        required: [true, "Name is required!"],
        trim: true
    },
    description: {
        type: String,
        minlenght: [25, "description must be atleast 25 characters long!"],
        maxlength: [500, "description can be at max 500 character long"],
        required: [true, "Product Description is required"]
    },
    price: {
        type: Number,
        required: [true, "price is required!"],
        maxlength: [8, "Price can not exceed 8 figures!"]
    },
    rating: {
        type: Number,
        default: 0
    },
    image: [
        {
            public_id: {
                type: String,
                required: [true]
            },
            url: {
                type: String,
                required: true
            }

        }
    ],
    catagorey: {
        type: String,
        required: [true, "Please enter product catagorey"]
        // leaving a loophole over here.
    },
    stock: {
        type: Number,
        required: [true, "Enter the quantity in stock!"],
        maxlength: [4, "Quantity in stock can not exceed 10000."]
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                minlenght: [4, "Name must be atleast 4 characters long"],
                maxlength: [155, "Name can be a maximum of 155 characters! "],
                required: [true, "Name is required!"],
                trim: true
            },
            rating: {
                type: Number,
                required: [true, "rating is required!"],
            },
            comment: {
                type: String,
                required: [true, "comment is required!"]
            }
        }
    ],
    manufacturer: {
        type: String,
        required: [true, "Manufacturer is required!"],
        maxlength: [100, "Manufacturer name cannot be more than 100 characters long!"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('product', productSchema);