const express = require("express");
const cors = require('cors');
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const ErrorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");



const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/allRoutes/products", productRoutes);
app.use("/api/allRoutes/user", userRoutes);

// error middleware.
app.use(ErrorMiddleware);


module.exports = app;
