// Select the button
const btn = document.getElementById("toggle-dark-button");
// Select the stylesheet <link>
const theme = document.querySelector("#theme-link");
//Select tables on pages
const containers = document.querySelectorAll(".container")
const cards = document.querySelectorAll(".card")
const lists = document.querySelectorAll(".list-group-item")
const tables = document.querySelectorAll(".table")
// Listen for a click on the button
btn.addEventListener("click", function () {
    // If the current URL contains "light-theme.css"
    if (theme.getAttribute("href") == "/css/light-theme.css") {
        // ... then switch it to "dark-theme.css"
        theme.href = "/css/dark-theme.css";
        containers.forEach((cont, index) => {
            cont.className = "container bg-dark text-white"
        });
        cards.forEach((card, index) => {
            card.className = "card text-white bg-dark"
        })
        lists.forEach((list, index) => {
            list.className = "list-group-item list-group-item-dark"
        })
        tables.forEach((table, index) => {
            table.className = "table table-striped table-dark"
        })
    } else {
        // ... switch it to "light-theme.css"
        theme.href = "/css/light-theme.css";
        containers.forEach((cont, index) => {
            cont.className = "container"
        });
        cards.forEach((card, index) => {
            card.className = "card"
        })
        lists.forEach((list, index) => {
            list.className = "list-group-item"
        })
        tables.forEach((table, index) => {
            table.className = "table table-striped"
        })
    }
});