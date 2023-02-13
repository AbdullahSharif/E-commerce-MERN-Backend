const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateProfile, getAllUsers, getSingleUserDetailsForAdmin, updateUserRole, deleteUser } = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/updatePassword").put(isAuthenticatedUser, updateUserPassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

// admin routes.
router.route("/admin/getAllUsers").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/getUserDetails/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUserDetailsForAdmin);
router.route("/admin/updateUserRole/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);
router.route("/admin/deleteUser/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;

