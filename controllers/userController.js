const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");


// ===============================
// User List
// ===============================
exports.index = async (req, res) => {

    try {

        const users = await userModel.getAll();

        res.render("users/index", {
            title: "User Management",
            user: req.session.user,
            users,

            success: req.flash("success"),
            error: req.flash("error"),
            warning: req.flash("warning")
        });

    } catch (err) {

        console.error(err);

        req.flash("error", "Unable to load users.");

        res.redirect("/dashboard");

    }

};


// ===============================
// Create Page
// ===============================
exports.create = async (req, res) => {

    res.render("users/create", {
        title: "Add User",
        user: req.session.user,

        success: req.flash("success"),
        error: req.flash("error"),
        warning: req.flash("warning")
    });

};
// ===============================
// Store User
// ===============================
exports.store = async (req, res) => {

    try {

        const {
            first_name,
            middle_name,
            last_name,
            username,
            email,
            password,
            role_id
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            first_name,
            middle_name,
            last_name,
            username,
            email,
            password: hashedPassword,
            role_id
        });

        req.flash("success", "User created successfully.");

        res.redirect("/users");

    } catch (err) {

        console.error(err);

        req.flash("error", "Unable to create user.");

        res.redirect("/users/create");

    }

};


// ===============================
// View User
// ===============================
exports.show = async (req, res) => {

    try {

        const data = await userModel.findById(req.params.id);

        res.render("users/show", {
            title: "View User",
            user: req.session.user,
            data
        });

    } catch (err) {

        console.error(err);

        req.flash("error", "User not found.");

        res.redirect("/users");

    }

};


// ===============================
// Edit Page
// ===============================
exports.edit = async (req, res) => {

    try {

        const data = await userModel.findById(req.params.id);

        res.render("users/edit", {
            title: "Edit User",
            user: req.session.user,
            data
        });

    } catch (err) {

        console.error(err);

        req.flash("error", "User not found.");

        res.redirect("/users");

    }

};


// ===============================
// Update User
// ===============================
exports.update = async (req, res) => {

    try {

        await userModel.update(
            req.params.id,
            req.body
        );

        req.flash("success", "User updated successfully.");

        res.redirect("/users");

    } catch (err) {

        console.error(err);

        req.flash("error", "Unable to update user.");

        res.redirect("/users");

    }

};


// ===============================
// Delete User
// ===============================
exports.destroy = async (req, res) => {

    try {

        await userModel.remove(req.params.id);

        req.flash("success", "User deleted successfully.");

        res.redirect("/users");

    } catch (err) {

        console.error(err);

        req.flash("error", "Unable to delete user.");

        res.redirect("/users");

    }

};