const products = require("./routes/products");
const express = require("express");
const error = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const app = express();
const registrations = require("./routes/users");
const orders = require("./routes/orders");
const bodyParser = require("body-parser");

app.use(express.json());

app.use(cookieParser());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
})
// routes
app.use("/api/v1", products);
app.use("/api/v1", registrations);
app.use("/api/v1", orders);
// error handling middleware
app.use(error);

module.exports = app;
