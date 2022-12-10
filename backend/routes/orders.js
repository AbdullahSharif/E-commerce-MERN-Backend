const express = require("express");
const { createOrder, getSingleOrder, deleteOrder, getAllOrdersOfLoggedIn, getAllOrdersInDB, updateOrderStatus } = require("../controllers/orderController");
const { authenticateUser, authenticateRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/orders/new").post(authenticateUser, createOrder);
router.route("/orders/:id").get(authenticateUser, getSingleOrder).delete(authenticateUser, deleteOrder);
router.route("/orders/me").get(authenticateUser, getAllOrdersOfLoggedIn);
router.route("/admin/orders/all").get(authenticateUser, authenticateRoles("admin"), getAllOrdersInDB);
router.route("/admin/order/:id").put(authenticateUser, authenticateRoles("admin"), updateOrderStatus);

module.exports = router;