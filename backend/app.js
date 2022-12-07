const products = require("./routes/products");
const express = require("express");
const error = require("./middlewares/error");
const app = express();
app.use(express.json());

// routes
app.use("/api/v1", products);

// error handling middleware
app.use(error);

module.exports = app;
