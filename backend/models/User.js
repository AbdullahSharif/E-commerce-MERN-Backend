const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

// now we need to hash the pasword when the password is modified.
userSchema.pre("save", async function (next) {
    if (this.isModified(["password"])) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);

        } catch (exc) {
            next(exc);
        }
    }
    return;
})

userSchema.methods.getJwtToken = function () {
    const jwtToken = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
    return jwtToken;
}

module.exports = mongoose.model('user', userSchema);