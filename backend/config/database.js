const mongoose = require("mongoose");

module.exports = function () {
    // , { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
    mongoose.connect(process.env.DB_URI).then(() => {
        console.log("Connected to mongoDB.");
    }).catch(exc => {
        console.log(exc);
    })
}