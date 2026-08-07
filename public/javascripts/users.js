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