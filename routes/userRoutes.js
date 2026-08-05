const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const userController = require("../controllers/userController");

// ===============================
// User List
// ===============================
router.get(
    "/",
    authMiddleware,
    roleMiddleware("Super Admin"),
    userController.index
);

// ===============================
// Create User
// ===============================
router.get(
    "/create",
    authMiddleware,
    roleMiddleware("Super Admin"),
    userController.create
);

router.post(
    "/create",
    authMiddleware,
    roleMiddleware("Super Admin"),
    userController.store
);

// ===============================
// View User
// ===============================
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("Super Admin"),
    userController.show
);

// ===============================
// Edit User
// ===============================
router.get(
    "/:id/edit",
    authMiddleware,
    roleMiddleware("Super Admin"),
    userController.edit
);

router.post(
    "/:id/edit",
    authMiddleware,
    roleMiddleware("Super Admin"),
    userController.update
);

// ===============================
// Delete User
// ===============================
router.post(
    "/:id/delete",
    authMiddleware,
    roleMiddleware("Super Admin"),
    userController.destroy
);

module.exports = router;