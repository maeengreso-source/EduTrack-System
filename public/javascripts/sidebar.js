document.addEventListener("DOMContentLoaded", () => {

    // Dropdown

    document.querySelectorAll(".menu-toggle").forEach(toggle => {

        const target = document.querySelector(
            toggle.getAttribute("href")
        );

        if (!target) return;

        target.addEventListener("shown.bs.collapse", () => {

            toggle.setAttribute("aria-expanded", "true");

        });

        target.addEventListener("hidden.bs.collapse", () => {

            toggle.setAttribute("aria-expanded", "false");

        });

    });

    // Scroll Top

    document.querySelectorAll(".sidebar a").forEach(link => {

        link.addEventListener("click", () => {

            const sidebar = document.getElementById("sidebar");

            if (sidebar) {

                sidebar.scrollTop = 0;

            }

        });

    });

});

function toggleSidebar() {

    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");

    if (!sidebar || !main) return;

    if (window.innerWidth <= 992) {

        sidebar.classList.toggle("show");

    } else {

        sidebar.classList.toggle("collapsed");
        main.classList.toggle("collapsed");

    }

}

window.addEventListener("resize", () => {

    const sidebar = document.getElementById("sidebar");

    if (!sidebar) return;

    if (window.innerWidth > 992) {

        sidebar.classList.remove("show");

    }

});