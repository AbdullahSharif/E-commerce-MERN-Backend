// this will be used to handle the errors when a specified entity is not found in the database.
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);

    }

}

module.exports = ErrorHandler;