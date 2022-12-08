const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/userController");

router.route("/registrations").post(createUser);

module.exports = router;