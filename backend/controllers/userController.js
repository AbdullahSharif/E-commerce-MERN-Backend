const User = require("../models/User");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

exports.createUser = asyncErrorHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password, avatar: {
            public_id: "123456",
            url: "firstImage"
        }
    });

    generateToken(user, 201, res);

})

exports.loginUser = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // check whether the user has provided email & password.
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email & password!", 400));
    }

    // find the user in the database.
    // here we need to explicitly select the password because while defining the model, we set the password select to false.
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password!", 401));
    }
    // if the user with the provided email exists, then check whether the password is correct or not.
    // const passwordValidation = user.comparePassword(password);

    if (!(await user.comparePassword(password))) { return next(new ErrorHandler("Invalid email or password!", 401)) };
    // if the user exists and all the provided credentials are true, then issue jwt.
    generateToken(user, 200, res);

})

exports.logout = asyncErrorHandler(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully!"
    })
})

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
    // first find the user.
    const user = await User.findOne({ email: req.body.email });
    if (!user) { return next(new ErrorHandler("Invalid Email!")); }

    // if the user is found.
    const resetToken = user.getResetPasswordToken();

    // save the token in the db in the user document.
    await user.save({ validateBeforeSave: false });

    // now we have to send the email to the user.

    // password reset link.
    const passwordResetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Please visit this link to reset your password! \n\n ${passwordResetUrl} \n\n if you have not requested this, then please ingnore it`;

    // now we need to send this message to the user.
    try {
        await sendEmail({
            email: req.body.email,
            subject: "Reset your password",
            message
        });
        res.status(200).json({
            success: true,
            message: "Email sent for password recovery"
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        next(new ErrorHandler(error.message, 500));

    }

})