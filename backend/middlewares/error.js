
module.exports = function (err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    if (err.code == 11000) {
        err.message = `Duplicate ${Object.keys(err.keyValue)} error.`
    }

    if (err.name == "JsonWebTokenError") {
        err.message = "JsonWebToken is invalid! Please login agian."
    }

    if (err.name == "TokenExpiredError") {
        err.message = "Token expired! Please login again."
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.stack
    });
}