module.exports = (...allowedRoles) => {

    return (req, res, next) => {

        // Check if user is logged in
        if (!req.session.user) {

            req.flash("warning", "Please login first.");
            return res.redirect("/login");

        }

        const userRole = req.session.user.role;

        // Check if role is allowed
        if (!allowedRoles.includes(userRole)) {

            console.log("==================================");
            console.log("🚫 ACCESS DENIED");
            console.log("URL           :", req.originalUrl);
            console.log("Method        :", req.method);
            console.log("User Role     :", userRole);
            console.log("Allowed Roles :", allowedRoles);
            console.log("==================================");

            req.flash("error", "You do not have permission to access this page.");

            return res.redirect("/dashboard");

        }

        next();

    };

};