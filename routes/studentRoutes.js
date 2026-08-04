const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.render("students/index", {
        title: "Students",
        user: req.session.user
    });
});

module.exports = router;