const express = require("express");
const router = express.Router();
const { createUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword } = require("../controllers/userController");
const { authenticateUser } = require("../middlewares/auth");

router.route("/registrations").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(authenticateUser, getUserDetails);
router.route("/password/update").put(authenticateUser, updatePassword);

module.exports = router;