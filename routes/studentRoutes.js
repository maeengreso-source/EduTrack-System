const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
    "/",
    authMiddleware,
    roleMiddleware("Super Admin", "Admin", "Registrar", "Staff", "Teacher"),
    (req, res) => {
        res.render("students/index", {
            title: "Students",
            user: req.session.user
        });
    }
);

module.exports = router;