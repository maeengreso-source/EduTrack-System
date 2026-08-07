const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const roleModel = require("../models/roleModel");
// ===============================
// User List
// ===============================
exports.index = async (req, res) => {

    try {

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const offset = (page - 1) * limit;

        // Search & Filters
        const search = req.query.search || "";
        const role = req.query.role || "";
        const status = req.query.status || "";

        // Users (Filtered)
        const users = await userModel.getAll(
            search,
            role,
            status,
            limit,
            offset
        );

        // Total Records (Filtered)
        const totalUsers = await userModel.countAll(
            search,
            role,
            status
        );

        // Dashboard Statistics (Not Filtered)
        const statistics = await userModel.getStatistics();

        // Roles
        const roles = await roleModel.getAll();
        
        const totalPages = Math.ceil(totalUsers / limit);

            res.render("users/index", {

                title: "User Management",
                user: req.session.user,

                users,
                roles,
                statistics,

                search,
                role,
                status,

                currentPage: page,
                totalPages,
                totalUsers,
                limit,

                success: req.flash("success"),
                error: req.flash("error"),
                warning: req.flash("warning")

            });
            } catch (err) {

                console.error(err);

                return res.status(500).send(err);

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
        
        // ===============================
        // Profile Image
        // ===============================

        const profile_image = req.file
            ? req.file.filename
            : "default-avatar-1.png";

        // ===============================
        // Generate Employee / Student ID
        // ===============================

        let employee_id = null;
        let student_id = null;

        if (Number(role_id) === 6) {

            student_id = await userModel.generateStudentId();

        } else {

            employee_id = await userModel.generateEmployeeId();

        }

        // ===============================
        // Hash Password
        // ===============================

        const hashedPassword = await bcrypt.hash(password, 10);

        // ===============================
        // Save User
        // ===============================

        await userModel.create({

            employee_id,
            student_id,

            first_name,
            middle_name,
            last_name,

            username,
            email,

            password: hashedPassword,

            role_id,

            profile_image

        });

        req.flash("success", "User created successfully.");

        return res.redirect("/users");

    } catch (err) {

        console.error(err);

        req.flash("error", err.message);

        return res.redirect("/users");

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
// Destroy User
// ===============================
exports.destroy = async (req, res) => {

    try {

        // Kunin ang user na ide-delete
        const targetUser = await userModel.findById(req.params.id);

        if (!targetUser) {

            req.flash("error", "User not found.");
            return res.redirect("/users");

        }

        // Bawal i-delete ang Super Administrator
        if (targetUser.role_name === "Super Administrator") {

            req.flash("error", "Super Administrator account cannot be deleted.");
            return res.redirect("/users");

        }

        // Delete user
        await userModel.remove(req.params.id);

        req.flash("success", "User deleted successfully.");

        res.redirect("/users");

    } catch (err) {

        console.error(err);

        req.flash("error", "Unable to delete user.");

        res.redirect("/users");

    }

};