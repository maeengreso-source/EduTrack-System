const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { isGuest } = require("../middleware/guestMiddleware");

router.get("/login", isGuest, authController.loginPage);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

module.exports = router;