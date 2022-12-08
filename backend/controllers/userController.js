const User = require("../models/User");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

exports.createUser = asyncErrorHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password, avatar: {
            public_id: "123456",
            url: "firstImage"
        }
    });
    const token = user.getJwtToken();
    return res.status(201).json({
        success: true,
        token
    });

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
    const token = user.getJwtToken();

    return res.status(200).json({
        success: true,
        token
    });



})