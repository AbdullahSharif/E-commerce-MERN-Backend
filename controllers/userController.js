const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail.js");

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

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    // find user.
    const user = await User.findOne({ email: req.body.email });

    // if user not found.
    if (!user) {
        return next(new ErrorHandler("No such user exists!"));
    }

    // if user exists, then generate a password reset token for the user.
    const token = user.setResetPasswordToken();

    // now when you have generated the token for the user and set it in the document.
    // save iy.
    await user.save();

    // now we preapre the email, which we have to send to the user to reset the password.
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/allRoutes/password/reset/${token}`;

    const message = `Your password reset Url is: \n\n
        ${resetPasswordUrl}
        \n\n
        If you have not made this request, please change your password! because your account might be at risk.
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: `My Ecommerce Password Recovery`,
            message
        });

        res.status(200).json({
            success: true,
            message: `Password recovery email sent to ${user.email}`
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

    }

})