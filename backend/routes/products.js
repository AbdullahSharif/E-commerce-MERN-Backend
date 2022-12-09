const express = require("express");
const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createOrUpdateReview, deleteReview, getAllProductReviews } = require("../controllers/productController");
const { authenticateUser, authenticateRoles } = require("../middlewares/auth");

router.route("/products").get(authenticateUser, getAllProducts);
router.route("/admin/product/new").post(authenticateUser, authenticateRoles("admin"), createProduct);
router.route("/admin/product/:id").put(authenticateUser, authenticateRoles("admin"), updateProduct).delete(authenticateUser, authenticateRoles("admin"), deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(authenticateUser, createOrUpdateReview);
router.route("/reviews/all").get(getAllProductReviews);
router.route("/review/delete").put(authenticateUser, deleteReview);


module.exports = router;