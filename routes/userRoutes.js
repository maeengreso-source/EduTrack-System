const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const userController = require("../controllers/userController");
const upload = require("../config/upload");

// ===============================
// User List
// ===============================
router.get(
    "/",
    authMiddleware,
    roleMiddleware("Super Administrator"),
    userController.index
);

// ===============================
// Create User Page
// ===============================
router.get(
    "/create",
    authMiddleware,
    roleMiddleware("Super Administrator"),
    userController.create
);

// ===============================
// Store User
// ===============================
router.post(
    "/create",
    authMiddleware,
    roleMiddleware("Super Administrator"),
    upload.single("profile_image"),
    userController.store
);

// ===============================
// View User
// ===============================
router.get(
    "/api/:id",
    authMiddleware,
    roleMiddleware("Super Administrator"),
    userController.getUser
);
// ===============================
// Edit User Page
// ===============================
router.get(
    "/:id/edit",
    authMiddleware,
    roleMiddleware("Super Administrator"),
    userController.edit
);

// ===============================
// Update User
// ===============================
router.post(
    "/:id/edit",
    authMiddleware,
    roleMiddleware("Super Administrator"),
    upload.single("profile_image"),
    userController.update
);

// ===============================
// Delete User
// ===============================
router.post(
    "/:id/delete",
    authMiddleware,
    roleMiddleware("Super Administrator"),
    userController.destroy
);

module.exports = router;