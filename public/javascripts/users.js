// ==========================================
// ADD USER MODAL
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const uploadInput = document.getElementById("profile_image");
    const previewImage = document.getElementById("previewImage");
    const uploadBtn = document.getElementById("uploadBtn");

    const roleSelect = document.getElementById("role_id");
    const idLabel = document.getElementById("idLabel");
    const idInput = document.getElementById("employee_student_id");

    const password = document.querySelector("input[name='password']");
    const confirmPassword = document.querySelector("input[name='confirm_password']");

    const modal = document.getElementById("addUserModal");

    // ==========================================
    // IMAGE PREVIEW
    // ==========================================

    if (uploadBtn && uploadInput) {

        uploadBtn.addEventListener("click", () => {
            uploadInput.click();
        });

    }

    if (previewImage && uploadInput) {

        previewImage.addEventListener("click", () => {
            uploadInput.click();
        });

    }

    if (uploadInput && previewImage) {

        uploadInput.addEventListener("change", function () {

            const file = this.files[0];

            if (!file) return;

            previewImage.src = URL.createObjectURL(file);

        });

    }

    // ==========================================
    // ROLE SWITCH
    // ==========================================

    function updateIdLabel() {

        if (!roleSelect || !idLabel || !idInput) return;

        const option = roleSelect.options[roleSelect.selectedIndex];

        if (!option) return;

        const roleName = option.dataset.role;

        if (roleName === "Student") {

            idLabel.textContent = "Student ID";
            idInput.placeholder = "Enter Student ID";
            idInput.name = "student_id";

        } else {

            idLabel.textContent = "Employee ID";
            idInput.placeholder = "Enter Employee ID";
            idInput.name = "employee_id";

        }

    }

    if (roleSelect) {

        roleSelect.addEventListener("change", updateIdLabel);

        updateIdLabel();

    }

    // ==========================================
    // PASSWORD VALIDATION
    // ==========================================

    function validatePassword() {

        if (!password || !confirmPassword) return;

        if (confirmPassword.value === "") {

            confirmPassword.setCustomValidity("");

            return;

        }

        if (password.value !== confirmPassword.value) {

            confirmPassword.setCustomValidity("Passwords do not match");

        } else {

            confirmPassword.setCustomValidity("");

        }

    }

    if (password) {

        password.addEventListener("keyup", validatePassword);

    }

    if (confirmPassword) {

        confirmPassword.addEventListener("keyup", validatePassword);

    }

    // ==========================================
    // RESET MODAL
    // ==========================================

    if (modal) {

        modal.addEventListener("hidden.bs.modal", () => {

            const form = modal.querySelector("form");

            if (form) {

                form.reset();

            }

            if (previewImage) {

                previewImage.src = "/images/default-avatar-1.png";

            }

            updateIdLabel();

        });

    }

});

// ==========================================
// VIEW USER
// ==========================================

document.querySelectorAll(".btn-view").forEach(button => {

    button.addEventListener("click", async () => {

        try {

            const id = button.dataset.id;

            const response = await fetch("/users/api/" + id);

            if (!response.ok) {
                throw new Error("Unable to load user.");
            }

            const user = await response.json();

            console.log("USER:", user); 
            // ==========================================
            // PROFILE IMAGE
            // ==========================================

            document.getElementById("viewProfileImage").src =
                user.profile_image
                    ? "/uploads/profiles/" + user.profile_image
                    : "/images/default-avatar-1.png";

            // ==========================================
            // EMPLOYEE / STUDENT ID
            // ==========================================

            const viewIdLabel = document.getElementById("viewIdLabel");
            const viewIdInput = document.getElementById("view_employee_student_id");

            if (user.role_name === "Student") {

                viewIdLabel.textContent = "Student ID";
                viewIdInput.value = user.student_id || "-";

            } else {

                viewIdLabel.textContent = "Employee ID";
                viewIdInput.value = user.employee_id || "-";

            }

            // ==========================================
            // PERSONAL INFORMATION
            // ==========================================

            document.getElementById("view_first_name").value = user.first_name || "-";
            document.getElementById("view_middle_name").value = user.middle_name || "-";
            document.getElementById("view_last_name").value = user.last_name || "-";
            document.getElementById("view_suffix").value = user.suffix || "-";
            document.getElementById("view_gender").value = user.gender || "-";
            document.getElementById("view_birthdate").value =
                user.birthdate
                    ? new Date(user.birthdate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })
                    : "-";
            // ==========================================
            // CONTACT INFORMATION
            // ==========================================

            document.getElementById("view_email").value = user.email || "-";
            document.getElementById("view_contact").value = user.contact_number || "-";

            // ==========================================
            // ACCOUNT INFORMATION
            // ==========================================

            document.getElementById("view_username").value = user.username || "-";
            document.getElementById("view_role").value = user.role_name || "-";
            document.getElementById("view_status").value = user.status || "-";

            document.getElementById("view_last_login").value =
                user.last_login
                    ? new Date(user.last_login).toLocaleString()
                    : "Never";

        } catch (err) {

            console.error(err);

            alert("Unable to load user information.");

        }

    });

});