const express = require("express");
const router = express.Router();
const { createUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController");
const { authenticateUser, authenticateRoles } = require("../middlewares/auth");

router.route("/registrations").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(authenticateUser, getUserDetails);
router.route("/password/update").put(authenticateUser, updatePassword);
router.route("/me/update").put(authenticateUser, updateProfile);
router.route("/admin/users").get(authenticateUser, authenticateRoles("admin"), getAllUsers);
router.route("/admin/user/:id").get(authenticateUser, authenticateRoles("admin"), getSingleUser);
router.route("/admin/user/update/:id").put(authenticateUser, authenticateRoles("admin"), updateUserRole);
router.route("/admin/user/delete/:id").delete(authenticateUser, authenticateRoles("admin"), deleteUser);

module.exports = router;