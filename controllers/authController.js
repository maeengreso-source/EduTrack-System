const bcrypt = require("bcrypt");
const User = require("../models/userModel");

// ===============================
// Login Page
// ===============================

exports.loginPage = (req, res) => {
  res.render("auth/login", {
    title: "Login",
    layout: false,
    error: null,
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
      return res.render("auth/login", {
        title: "Login",
        layout: false,
        error: "Username and password are required.",
      });
    }

    // Find user
    const user = await User.findByUsername(username);

    if (!user) {
      return res.render("auth/login", {
        title: "Login",
        layout: false,
        error: "Invalid username or password.",
      });
    }

    // Check status
    if (user.status !== "Active") {
      return res.render("auth/login", {
        title: "Login",
        layout: false,
        error: `Account is ${user.status}.`,
      });
    }

    // Check account lock
    if (
      user.locked_until &&
      new Date(user.locked_until) > new Date()
    ) {
      return res.render("auth/login", {
        title: "Login",
        layout: false,
        error: "Your account is temporarily locked.",
      });
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
      }

      return res.render("auth/login", {
        title: "Login",
        layout: false,
        error: "Invalid username or password.",
      });
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

    res.redirect("/dashboard");

  } catch (err) {

    console.error(err);

    res.render("auth/login", {
      title: "Login",
      layout: false,
      error: "Server Error",
    });

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