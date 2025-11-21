document.addEventListener("click", function (e) {
    var toggle = document.getElementById("menu-toggle");
    if (!toggle) return;
    var link = e.target.closest && e.target.closest("a");
    if (!link) return;
    if (link.closest(".menu-items") || link.closest(".rules-nav")) {
        toggle.checked = false;
    }
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        var toggle = document.getElementById("menu-toggle");
        if (toggle) toggle.checked = false;
    }
});
