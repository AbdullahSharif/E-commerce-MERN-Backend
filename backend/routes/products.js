const express = require("express");
const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const { authenticateUser, authenticateRoles } = require("../middlewares/auth");

router.route("/products").get(authenticateUser, getAllProducts);
router.route("/product/new").post(authenticateUser, authenticateRoles("admin"), createProduct);
router.route("/product/:id").put(authenticateUser, authenticateRoles("admin"), updateProduct).get(getProductDetails).delete(authenticateUser, authenticateRoles("admin"), deleteProduct);


module.exports = router;