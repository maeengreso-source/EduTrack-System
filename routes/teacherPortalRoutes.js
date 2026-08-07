const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
    "/",
    authMiddleware,
    roleMiddleware("Teacher"),
    (req, res) => {
        res.render("teacher/dashboard", {
            title: "Teacher Dashboard",
            user: req.session.user
        });
    }
);

module.exports = router;