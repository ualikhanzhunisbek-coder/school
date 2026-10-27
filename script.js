const content = {
    kk: {
        news: [
            {
                title: "161 PARLAMENT жұмысы",
                text: "Мектеп өмірін жақсартуға арналған жаңа идеялар мен жобалар.",
                date: "Парламент жаңалығы"
            },
            {
                title: "Оқушылардың дауысы маңызды",
                text: "Өз пікіріңді білдіріп, мектеп өміріне белсенді қатыс!",
                date: "Хабарландыру"
            },
            {
                title: "Жаңа бастамалар",
                text: "Бірге ойлаймыз, бірге талқылаймыз, бірге өзгертеміз.",
                date: "Біздің мақсатымыз"
            }
        ],
        events: [
            {
                title: "Таланттар шоуы",
                text: "Өз талантыңды көрсетіп, мектеп сахнасына шық!",
                date: "Күні нақтыланады"
            },
            {
                title: "Спорт күні",
                text: "Белсенділік, командалық рух және жақсы көңіл күй!",
                date: "Күні нақтыланады"
            },
            {
                title: "Қайырымдылық жәрмеңкесі",
                text: "Жақсылық жасауға бірге атсалысайық.",
                date: "Күні нақтыланады"
            }
        ],
        pollTitle: "Қандай іс-шараны таңдайсың?",
        options: ["Таланттар шоуы", "Спорт күні", "Қайырымдылық жәрмеңкесі"],
        voteButton: "Дауыс беру",
        voted: "Дауыс қабылданды!",
        already: "Бұл браузерде дауыс берілген.",
        choose: "Алдымен бір нұсқаны таңда.",
        saved: "Ұсынысың осы құрылғыда сақталды.",
        error: "Алдымен идеяңды жаз.",
        count: "дауыс",
        anonymous: "Анонимді ұсыныс"
    },
    ru: {
        news: [
            {
                title: "Работа 161 PARLAMENT",
                text: "Новые идеи и проекты для улучшения школьной жизни.",
                date: "Новости парламента"
            },
            {
                title: "Голос учеников важен",
                text: "Выражай своё мнение и активно участвуй в жизни школы!",
                date: "Объявление"
            },
            {
                title: "Новые инициативы",
                text: "Думаем вместе, обсуждаем вместе, меняем вместе.",
                date: "Наша цель"
            }
        ],
        events: [
            {
                title: "Шоу талантов",
                text: "Покажи свои способности на школьной сцене!",
                date: "Дата уточняется"
            },
            {
                title: "День спорта",
                text: "Активность, командный дух и хорошее настроение!",
                date: "Дата уточняется"
            },
            {
                title: "Благотворительная ярмарка",
                text: "Давайте вместе делать добрые дела.",
                date: "Дата уточняется"
            }
        ],
        pollTitle: "Какое мероприятие ты выбираешь?",
        options: ["Шоу талантов", "День спорта", "Благотворительная ярмарка"],
        voteButton: "Проголосовать",
        voted: "Голос принят!",
        already: "В этом браузере уже голосовали.",
        choose: "Сначала выбери один вариант.",
        saved: "Предложение сохранено на этом устройстве.",
        error: "Сначала напиши свою идею.",
        count: "голосов",
        anonymous: "Анонимное предложение"
    }
};

let language = "kk";

const $ = selector => document.querySelector(selector);

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch {
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

function renderCards(selector, items) {
    const container = $(selector);

    container.replaceChildren();

    items.forEach(item => {
        const card = document.createElement("article");
        card.className = "card";

        const date = document.createElement("small");
        date.textContent = item.date;

        const title = document.createElement("h3");
        title.textContent = item.title;

        const text = document.createElement("p");
        text.textContent = item.text;

        card.append(date, title, text);
        container.appendChild(card);
    });
}

function renderPoll() {
    const t = content[language];
    const stored = readStorage("school161Votes", [0, 0, 0]);
    const votes = Array.isArray(stored) && stored.length === 3
        ? stored.map(v => Number.isFinite(v) && v >= 0 ? v : 0)
        : [0, 0, 0];

    const container = $("#pollList");
    container.replaceChildren();

    const card = document.createElement("div");
    card.className = "poll-card";

    const title = document.createElement("h3");
    title.textContent = t.pollTitle;
    card.appendChild(title);

    t.options.forEach((option, index) => {
        const row = document.createElement("div");
        row.className = "poll-option";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "poll";
        input.id = `poll-option-${index}`;
        input.value = String(index);

        const label = document.createElement("label");
        label.htmlFor = input.id;
        label.textContent = option;

        const count = document.createElement("small");
        count.textContent = `${votes[index]} ${t.count}`;

        row.append(input, label, count);
        card.appendChild(row);
    });

    const button = document.createElement("button");
    button.type = "button";
    button.className = "main-btn";
    button.textContent = t.voteButton;

    button.addEventListener("click", () => {
        const selected = document.querySelector(
            'input[name="poll"]:checked'
        );

        if (!selected) {
            $("#voteMessage").textContent = t.choose;
            return;
        }

        if (localStorage.getItem("school161HasVoted") === "yes") {
            $("#voteMessage").textContent = t.already;
            return;
        }

        const latest = readStorage("school161Votes", [0, 0, 0]);
        const updated = Array.isArray(latest) && latest.length === 3
            ? latest.map(v => Number.isFinite(v) && v >= 0 ? v : 0)
            : [0, 0, 0];

        updated[Number(selected.value)]++;

        if (!writeStorage("school161Votes", updated)) {
            $("#voteMessage").textContent =
                language === "kk"
                    ? "Деректерді сақтау мүмкін болмады."
                    : "Не удалось сохранить данные.";
            return;
        }

        try {
            localStorage.setItem("school161HasVoted", "yes");
        } catch {
            $("#voteMessage").textContent =
                language === "kk"
                    ? "Деректерді сақтау мүмкін болмады."
                    : "Не удалось сохранить данные.";
            return;
        }

        $("#voteMessage").textContent = t.voted;
        renderPoll();
    });

    card.appendChild(button);
    container.appendChild(card);
}

function renderPage() {
    const t = content[language];

    document.documentElement.lang = language;

    document.querySelectorAll("[data-kk]").forEach(element => {
        element.textContent = element.dataset[language];
    });

    $("#languageBtn").textContent = language === "kk" ? "RU" : "KZ";

    renderCards("#newsList", t.news);
    renderCards("#eventsList", t.events);
    renderPoll();
}

$("#languageBtn").addEventListener("click", () => {
    language = language === "kk" ? "ru" : "kk";
    renderPage();
});

$("#ideaForm").addEventListener("submit", event => {
    event.preventDefault();

    const t = content[language];
    const field = $("#idea");
    const idea = field.value.trim();

    if (!idea) {
        $("#ideaMessage").textContent = t.error;
        return;
    }

    const savedIdeas = readStorage("school161Ideas", []);

    if (!Array.isArray(savedIdeas)) {
        $("#ideaMessage").textContent =
            language === "kk"
                ? "Сақтау қатесі."
                : "Ошибка сохранения.";
        return;
    }

    savedIdeas.push({
        text: idea,
        anonymous: $("#anonymous").checked,
        date: new Date().toISOString()
    });

    if (!writeStorage("school161Ideas", savedIdeas)) {
        $("#ideaMessage").textContent =
            language === "kk"
                ? "Ұсынысты сақтау мүмкін болмады."
                : "Не удалось сохранить предложение.";
        return;
    }

    field.value = "";
    $("#ideaMessage").textContent = t.saved;
});

$("#year").textContent = new Date().getFullYear();

renderPage();