
exports.index = (req, res) => {

    res.render("dashboard/index", {
        title: "Dashboard",
        user: req.session.user

    });

};