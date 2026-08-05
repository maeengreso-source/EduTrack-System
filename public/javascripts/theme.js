// ==========================================
// Apply Theme
// ==========================================

function applyTheme(theme) {

    const isDark = theme === "dark";

    document.documentElement.classList.toggle("dark", isDark);

    localStorage.setItem("theme", theme);

}

// ==========================================
// Apply Saved Theme Immediately
// ==========================================

const savedTheme = localStorage.getItem("theme") || "light";

applyTheme(savedTheme);

// ==========================================
// Initialize Theme Toggle
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) return;

    // Sync switch state
    themeToggle.checked = document.body.classList.contains("dark");

    // Toggle theme
    themeToggle.addEventListener("change", () => {

        const theme = themeToggle.checked ? "dark" : "light";

        applyTheme(theme);

    });

});