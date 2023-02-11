const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

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
        return next(new ErrorHandler("No such user exists!"), 404);
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

        return res.status(200).json({
            success: true,
            message: `Password recovery email sent to ${user.email}`
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

    }

})

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // since we have sent the url to the user in the email.
    // the url contains the token.

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Reset password token is Invalid or token has expired!", 401));
    }

    // check if the entered password and confirm password are same.
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password and confirm password does not match!", 400));
    }

    // match if the password eneterd is previous one or not.
    const isPreviousPassword = await user.comparePassword(req.body.password);

    if (!isPreviousPassword) {
        return next("You have entered your previous password. Please change it!", 400);
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)



})