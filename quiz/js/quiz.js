var questions = [];

fetch("./data/questions.json")
    .then(function (r) {
        return r.json();
    })
    .then(function (data) {
        questions = data.questions;
        start();
    });

function start() {
    var page = document.body.id;
    if (page === "page-index") {
        var btns = document.querySelectorAll(".level-btn");
        btns.forEach(function (b) {
            b.addEventListener("click", function () {
                window.location = "play.html";
            });
        });
        return;
    }

    if (page === "page-play") {
        var pagePlay = document.getElementById("page-play");
        var choices = document.getElementById("choices");
        var choicesContainer = document.querySelector(".choices-container") || choices;
        var back = document.getElementById("back");
        var levelChooser = document.getElementById("level-chooser");
        var questionArea = document.getElementById("question-area");
        var textAnswer = document.getElementById("text-answer");
        var textInput = document.getElementById("text-input");
        var textSubmit = document.getElementById("text-submit");

        back.addEventListener("click", function () {
            window.location = "index.html";
        });

        var qText = document.getElementById("question-text");
        var headerCards = document.querySelectorAll(".header-question h2");
        var pageEl = document.getElementById("page-play");

        function setHeaderText(t) {
            headerCards.forEach(function (el) {
                el.textContent = t || "";
            });
        }

        var used = [];
        var lastCard = "";

        if (questions && questions.length > 0) {
            lastCard = questions[0].card || "";
            setHeaderText(lastCard);
        }

        function pick(level) {
            var pool = questions.filter(function (q) {
                return String(q.level) === String(level) && used.indexOf(q.id) === -1;
            });
            if (used.length >= questions.length) {
                used = [];
            }
            if (pool.length === 0) {
                pool = questions.filter(function (q) {
                    return String(q.level) === String(level);
                });
            }
            var q = pool[Math.floor(Math.random() * pool.length)];
            used.push(q.id);
            return q;
        }

        function show(q) {
            levelChooser.style.display = "none";
            questionArea.style.display = "block";
            if (pageEl && pageEl.classList) pageEl.classList.add("question-block");
            setHeaderText(q.card || "");
            lastCard = q.card || "";
            qText.textContent = q.question || "";
            choices.innerHTML = "";
            if (q.qtype === "text") {
                textAnswer.style.display = "flex";
                textInput.value = "";
                textSubmit.onclick = function () {
                    var user = (textInput.value || "").trim().toLowerCase();
                    var expected = (q.answer_text || "").trim().toLowerCase();
                    var correct = expected.length > 0 && user === expected;
                    setTimeout(function () {
                        questionArea.style.display = "none";
                        levelChooser.style.display = "block";
                        setHeaderText(lastCard);
                        if (pageEl && pageEl.classList) pageEl.classList.remove("question-block");
                        var correctText = q.qtype === "text" ? q.answer_text || "" : (q.choices && q.choices[q.answer]) || "";
                        try {
                            sessionStorage.setItem("lastCorrect", correctText);
                            sessionStorage.setItem("lastQuestionId", q.id || "");
                        } catch (e) {}
                        var target =
                            (correct ? "success.html" : "fail.html") +
                            "?correct=" +
                            encodeURIComponent(correctText) +
                            "&id=" +
                            encodeURIComponent(q.id || "");
                        window.location = target;
                    }, 300);
                };
                return;
            }
            textAnswer.style.display = "none";
            q.choices.forEach(function (c, idx) {
                var b = document.createElement("button");
                b.type = "button";
                b.className = "choice h2";
                b.textContent = c;
                b.dataset.index = String(idx);
                b.addEventListener("click", function () {
                    var correct = Number(b.dataset.index) === Number(q.answer);
                    setTimeout(function () {
                        questionArea.style.display = "none";
                        levelChooser.style.display = "block";
                        setHeaderText(lastCard);
                        if (pageEl && pageEl.classList) pageEl.classList.remove("question-block");
                        var correctText = q.qtype === "text" ? q.answer_text || "" : (q.choices && q.choices[q.answer]) || "";
                        try {
                            sessionStorage.setItem("lastCorrect", correctText);
                            sessionStorage.setItem("lastQuestionId", q.id || "");
                        } catch (e) {}
                        var target =
                            (correct ? "success.html" : "fail.html") +
                            "?correct=" +
                            encodeURIComponent(correctText) +
                            "&id=" +
                            encodeURIComponent(q.id || "");
                        window.location = target;
                    }, 300);
                });
                choices.appendChild(b);
            });
        }

        var levelBtns = document.querySelectorAll("#level-chooser .level-btn");
        levelBtns.forEach(function (lb) {
            lb.addEventListener("click", function () {
                var lvl = lb.dataset.level || "1";
                var levelClass = lvl === "1" ? "facile" : lvl === "2" ? "intermediaire" : "expert";
                if (choicesContainer && choicesContainer.classList) {
                    choicesContainer.classList.remove("facile", "intermediaire", "expert");
                    choicesContainer.classList.add(levelClass);
                }
                var q = pick(lvl);
                lastCard = q.card || "";
                setHeaderText(lastCard);
                show(q);
            });
        });

        levelChooser.style.display = "block";
        setHeaderText(lastCard);
        questionArea.style.display = "none";
        if (pageEl && pageEl.classList) pageEl.classList.remove("question-block");
    }
}
