const User = require("../models/User");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
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

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
    // find the user with the given token.
    // console.log(req.params.token);
    const user = await User.findOne({
        resetPasswordToken: crypto.createHash("sha256").update(req.params.token).digest("hex"),
        resetPasswordExpire: { $gt: Date.now() }
    })
    // console.log(user);
    if (!user) { return next(new ErrorHandler("Invalid requets or the token has expired!", 400)) };

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password & confirm password does not match!", 400));
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    generateToken(user, 200, res);
})

// get user details
exports.getUserDetails = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user
    });
});

// update password.
exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password");

    const isOldPasswordMatched = user.comparePassword(req.body.oldPassword);
    if (!isOldPasswordMatched) { return next(new ErrorHandler("Old password does not match!", 400)) }

    if (req.body.newPassword !== req.body.confirmPassword) { return next(new ErrorHandler("Password and Confirm password fields do not match!")) }

    user.password = req.body.newPassword;

    await user.save();

    generateToken(user, 200, res);

})

// update profile.
exports.updateProfile = asyncErrorHandler(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email
    }

    await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    })

})

// get all the users -- Admin route
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })

})

// get a single user -- Admin route
exports.getSingleUser = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) { return next(new ErrorHandler("No such user exists!", 400)) }

    res.status(200).json({
        success: true,
        user
    })
})

// admin can update the role of a single user.
exports.updateUserRole = asyncErrorHandler(async (req, res, next) => {
    const newUserData = {
        email: req.body.email,
        name: req.body.name,
        role: req.body.role
    }

    // find the user
    const user = await User.findById(req.params.id);

    if (!user) { return next(new ErrorHandler("User not found!", 404)) }

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        useFindAndModify: false,
        runValidators: true
    })

    res.status(200).json({
        success: true
    })
})

// admin can delete a user. (unless it is not another admin)
exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
    // find the user.
    const user = await User.findById(req.params.id);
    if (!user) { return next(new ErrorHandler("No Such user exists!", 404)) }
    if (user.role == "admin") { return res.status(400).json({ success: true, message: "Admin can not be deleted!" }) }

    await user.remove();
    res.status(200).json({
        success: true
    })
})