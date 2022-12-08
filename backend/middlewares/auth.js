const ErrorHandler = require("../utils/errorHandler");
const asyncErrorHandler = require("./asyncErrorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser = asyncErrorHandler(async (req, res, next) => {
    if (!req.cookies) { return next(new ErrorHandler("Cookie not set!", 500)) };
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please login for accessing this page!", 400));
    }

    decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    next();
})

const authenticateRoles = (...roles) => {
    return asyncErrorHandler((req, res, next) => {

        if (!roles.includes(req.user.role)) {
            // if the user is not admin
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource!`));

        }
        return next();



    });
}

module.exports.authenticateUser = authenticateUser;
module.exports.authenticateRoles = authenticateRoles;