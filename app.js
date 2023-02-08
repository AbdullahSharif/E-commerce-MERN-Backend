const express = require("express");
const cors = require('cors');
const productRoutes = require("./routes/productRoutes");
const ErrorMiddleware = require("./middleware/error");



const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/allRoutes/products", productRoutes);

// error middleware.
app.use(ErrorMiddleware);


module.exports = app;
