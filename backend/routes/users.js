const express = require("express");
const router = express.Router();
const { createUser, loginUser, logout } = require("../controllers/userController");

router.route("/registrations").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

module.exports = router;