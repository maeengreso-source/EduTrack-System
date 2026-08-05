const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const guestMiddleware = require("../middleware/guestMiddleware");

// Login Page
router.get(
    "/login",
    guestMiddleware,
    authController.loginPage
);

// Login Process
router.post(
    "/login",
    guestMiddleware,
    authController.login
);

// Logout
router.get(
    "/logout",
    authController.logout
);

module.exports = router;