const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const User = require("../models/userModel");

// register a user.

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "sample_id",
            url: "sample_url"
        }
    });

    sendToken(user, 201, res);


})

// login a user.
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Enter email & password!", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("User not found!", 404));
    }

    const passwordMatched = await user.comparePassword(password);

    if (!passwordMatched) {
        return next(new ErrorHandler("Invalid email or password!", 401));
    }

    sendToken(user, 200, res);

})

exports.logoutUser = catchAsyncErrors(async (req, res, user) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    return res.status(200).json({
        success: true,
        message: "Logged out!"
    })
})