const dares = [
  { text: "Give a dramatic acceptance speech for winning an award nobody else knows about.", category: "silly", difficulty: 2 },
  { text: "Send a friend a voice note singing the chorus of a song you both know.", category: "social", difficulty: 1 },
  { text: "Invent a new holiday and explain its traditions with complete confidence.", category: "creative", difficulty: 2 },
  { text: "Let the group choose your new name for the next ten minutes.", category: "brave", difficulty: 3 },
  { text: "Make up a tiny weather forecast for the room you are in.", category: "silly", difficulty: 1 },
  { text: "Draw a portrait of someone here using your non-dominant hand.", category: "creative", difficulty: 1 },
  { text: "Ask someone to teach you a move, then perform it like it is your signature.", category: "social", difficulty: 2 },
  { text: "Read your last text message in the voice of a nature documentary narrator.", category: "silly", difficulty: 2 },
  { text: "Give a genuine, specific compliment to the person across from you.", category: "social", difficulty: 1 },
  { text: "Call a friend and ask them to name a color. Wear or find that color now.", category: "brave", difficulty: 2 },
  { text: "Create a three-step dance for an imaginary song and teach it to the room.", category: "creative", difficulty: 3 },
  { text: "Let someone else pick a harmless word you must use in every sentence for five minutes.", category: "brave", difficulty: 3 },
  { text: "Describe your day using only movie titles.", category: "creative", difficulty: 2 },
  { text: "Make the sound effect for every action you take for the next minute.", category: "silly", difficulty: 2 },
  { text: "Tell the person next to you one tiny thing that made you happy this week.", category: "social", difficulty: 1 }
];

const text = document.querySelector("#dare-text");
const number = document.querySelector("#dare-number");
const category = document.querySelector("#dare-category");
const difficultyLabel = document.querySelector("#dare-difficulty");
const difficulty = document.querySelector("#difficulty");
const difficultyValue = document.querySelector("#difficulty-value");
const dareCard = document.querySelector(".dare-card");
const historyList = document.querySelector("#history-list");
const toast = document.querySelector("#toast");
let currentDare = dares[0];
let dareCount = 1;
let history = JSON.parse(localStorage.getItem("go-on-then-history") || "[]");

const categoryNames = { all: "Anything", social: "Social", silly: "Silly", creative: "Creative", brave: "Brave" };
const difficultyNames = { 1: "Gentle", 2: "Medium", 3: "Bold" };

function filteredDares() {
  const activeCategory = document.querySelector(".filter-button.is-active").dataset.category;
  const maxDifficulty = Number(difficulty.value);
  return dares.filter((item) => (activeCategory === "all" || item.category === activeCategory) && item.difficulty <= maxDifficulty);
}

function renderDare(nextDare) {
  currentDare = nextDare;
  text.textContent = currentDare.text;
  category.textContent = categoryNames[currentDare.category].toUpperCase();
  difficultyLabel.textContent = `LEVEL ${currentDare.difficulty} / 3`;
  number.textContent = `DARE ${String(dareCount).padStart(3, "0")}`;
}

function showNewDare() {
  const options = filteredDares().filter((item) => item !== currentDare);
  const pool = options.length ? options : filteredDares();
  if (!pool.length) return;
  dareCard.classList.add("is-changing");
  setTimeout(() => {
    dareCount += 1;
    renderDare(pool[Math.floor(Math.random() * pool.length)]);
    dareCard.classList.remove("is-changing");
    addToHistory(currentDare);
  }, 130);
}

function addToHistory(item) {
  history = [{ ...item, id: Date.now() }, ...history.filter((oldItem) => oldItem.text !== item.text)].slice(0, 3);
  localStorage.setItem("go-on-then-history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  if (!history.length) {
    historyList.innerHTML = '<p class="empty-history">Your next few questionable decisions will appear here.</p>';
    return;
  }
  historyList.innerHTML = history.map((item, index) => `
    <article class="history-item">
      <div class="card-topline"><span>RECENT 0${index + 1}</span><span>${categoryNames[item.category].toUpperCase()}</span></div>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

async function copyDare() {
  try {
    await navigator.clipboard.writeText(currentDare.text);
    showToast("Dare copied to your clipboard.");
  } catch {
    showToast("Select and copy the dare above.");
  }
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter-button.is-active").classList.remove("is-active");
    button.classList.add("is-active");
    const next = filteredDares()[0];
    if (next) renderDare(next);
  });
});

difficulty.addEventListener("input", () => {
  difficultyValue.textContent = difficulty.value === "3" ? "Any level" : `Up to ${difficultyNames[difficulty.value].toLowerCase()}`;
  const next = filteredDares()[0];
  if (next) renderDare(next);
});

document.querySelector("#new-dare-button").addEventListener("click", showNewDare);
document.querySelector("#copy-button").addEventListener("click", copyDare);
document.querySelector("#clear-history").addEventListener("click", () => {
  history = [];
  localStorage.removeItem("go-on-then-history");
  renderHistory();
  showToast("History cleared.");
});
document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && event.target.tagName !== "INPUT" && event.target.tagName !== "BUTTON") {
    event.preventDefault();
    showNewDare();
  }
});

renderHistory();
