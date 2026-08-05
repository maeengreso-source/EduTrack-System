document.addEventListener("DOMContentLoaded", () => {

    const toastElements = document.querySelectorAll(".toast");

    if (!toastElements.length) return;

    toastElements.forEach(element => {

        new bootstrap.Toast(element, {
            autohide: true,
            delay: 3000
        }).show();

    });

});