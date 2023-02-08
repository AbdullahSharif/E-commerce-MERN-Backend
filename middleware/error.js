const ErrorHandler = require("../utils/errorHandler.js");
// it will be used to catch the errors thrown when a particular entity is not found in the db.
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong Mongo DB id error.
    if (err.name === "CastError") {
        const message = `Resource not found! Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })

} 