const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required!"],
        maxlength: [40, "Name cannot be more than 40 characters long."],
        minlength: [4, "Name must be atleast 4 characters long."]
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: [true, "User already registered!"],
        validate: [validator.isEmail, "Please enter a valid email!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        select: false,
        minlength: [8, "Password must be atleast 8 characters long!"],
        maxlength: [100, "Password cannot be longer than 100 characters!"]
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

})

module.exports = mongoose.model('user', userSchema);