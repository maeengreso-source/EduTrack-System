const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const guestMiddleware = require("../middleware/guestMiddleware");


exports.testFlash = (req, res) => {
    req.flash("success", "Flash message is working!");
    res.redirect("/dashboard");
};

// ===============================
// Login Page
// ===============================
exports.loginPage = (req, res) => {
  res.render("auth/login", {
    title: "Login",
    layout: false,
  });
};
// ===============================
// Login
// ===============================

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      req.flash("warning", "Username and password are required.");
      return res.redirect("/login");
    }

    // Find user
    const user = await User.findByUsername(username);

    if (!user) {
    req.flash("error", "Invalid username or password.");
      return res.redirect("/login");
    }

    // Check status
    if (user.status !== "Active") {
      req.flash("warning", `Account is ${user.status}.`);
      return res.redirect("/login");
    }

    // Check account lock
  if (user.locked_until) {

    const now = new Date();
    const lockedUntil = new Date(user.locked_until);

    // Still locked
    if (lockedUntil > now) {

        req.flash(
            "warning",
            "Your account is temporarily locked. Please try again later."
        );

        return res.redirect("/login");

    }

    // Lock expired -> Automatically unlock account
    await User.unlockAccount(user.id);

}

    // Compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {

      await User.incrementFailedAttempts(user.id);

      // Lock after 5 failed attempts
      if (user.failed_login_attempts + 1 >= 5) {

        const lockTime = new Date();
        lockTime.setMinutes(lockTime.getMinutes() + 15);

        await User.lockAccount(user.id, lockTime);

        req.flash(
          "error",
          "Your account has been locked for 15 minutes due to multiple failed login attempts."
        );

        return res.redirect("/login");
      }

      req.flash("error", "Invalid username or password.");
      return res.redirect("/login");
    }

    // Reset failed attempts
    await User.resetFailedAttempts(user.id);

    // Update last login
    await User.updateLastLogin(user.id);

    // Create Session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role_name,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_image: user.profile_image,
    };

    req.flash("success", `Welcome back, ${user.first_name}!`);

    return res.redirect("/dashboard");

  } catch (err) {

    console.error(err);

    req.flash("error", "An unexpected server error occurred.");

    return res.redirect("/login");
  }
};
// ===============================
// Logout
// ===============================

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");

  });

};