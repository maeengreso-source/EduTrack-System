const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");

router.get(
    "/",
    authMiddleware,
    cacheMiddleware,
    dashboardController.index
);

module.exports = router;