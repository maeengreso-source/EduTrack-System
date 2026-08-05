module.exports = (req, res, next) => {

    if (!req.session.user) {
        req.flash("warning", "Please login first.");
        return res.redirect("/login");
    }

    next();

};