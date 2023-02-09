const expres = require("express");
const router = expres.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/allProducts").get(getAllProducts);
router.route("/createProduct").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.route("/updateProduct/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
router.route("/deleteProduct/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
router.route("/allProducts/product/:id").get(getProductDetails);



module.exports = router;