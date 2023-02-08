const expres = require("express");
const router = expres.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");

router.route("/allProducts").get(getAllProducts);
router.route("/createProduct").post(createProduct);
router.route("/updateProduct/:id").put(updateProduct);
router.route("/deleteProduct/:id").delete(deleteProduct);
router.route("/allProducts/product/:id").get(getProductDetails);



module.exports = router;