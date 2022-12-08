const products = require("./routes/products");
const express = require("express");
const error = require("./middlewares/error");
const app = express();
const registrations = require("./routes/users");
app.use(express.json());

// routes
app.use("/api/v1", products);
app.use("/api/v1", registrations);

// error handling middleware
app.use(error);

module.exports = app;
