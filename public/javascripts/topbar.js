/* ==========================================
   PROFILE DROPDOWN
========================================== */

function toggleProfileDropdown() {

    const profile = document.getElementById("profile");
    const dropdown = document.getElementById("profileDropdown");

    if (!profile || !dropdown) {
        return;
    }

    profile.classList.toggle("open");
    dropdown.classList.toggle("show");
}


/* ==========================================
   CLOSE DROPDOWN WHEN CLICKING OUTSIDE
========================================== */

document.addEventListener("click", function (event) {

    const profile = document.getElementById("profile");
    const dropdown = document.getElementById("profileDropdown");

    if (!profile || !dropdown) {
        return;
    }

    if (!profile.contains(event.target)) {

        profile.classList.remove("open");
        dropdown.classList.remove("show");

    }

});