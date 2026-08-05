const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.render("teachers/index", {
        title: "Teachers",
        user: req.session.user
    });
});

module.exports = router;