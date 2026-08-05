document.addEventListener("DOMContentLoaded", () => {

    function updateDateTime() {

        const now = new Date();

        document.getElementById("currentDate")?.replaceChildren(
            document.createTextNode(
                now.toLocaleDateString("en-PH", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
            )
        );

        document.getElementById("currentTime")?.replaceChildren(
            document.createTextNode(
                now.toLocaleTimeString("en-PH", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                })
            )
        );
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

});