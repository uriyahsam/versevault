import { getDailyVerse, getDailyQuote, getAuthorSummary } from "./api.mjs";
import { renderVerse, renderQuote } from "./VerseQuote.mjs";
import { addEntry } from "./Journal.mjs";
import { renderEntryList } from "./EntryList.mjs";
import { initDarkToggle } from "./Settings.mjs";

const authorCache = new Map();

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

// Simple hash router to toggle .view sections
function route(){
  const hash = location.hash.replace("#","") || "home";
  document.querySelectorAll(".view").forEach(v => v.hidden = true);
  const active = document.getElementById(hash) || document.getElementById("home");
  active.hidden = false;
  active.classList.remove("fade-in");
  // trigger reflow to restart animation
  void active.offsetWidth;
  active.classList.add("fade-in");

  // If we switched to history, refresh list
  if (active.id === "history") {
    const container = document.getElementById("entry-list");
    renderEntryList(container);
  }
}
window.addEventListener("hashchange", route);

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Dark mode
initDarkToggle(document.getElementById("dark-mode-toggle"));

// Load verse & quote on Home
(async function initHome(){
  const verseEl = document.getElementById("daily-verse");
  const quoteEl = document.getElementById("daily-quote");
  const verse = await getDailyVerse();   // randomized verse (fallback safe)
  const quote = await getDailyQuote();   // quote of the day (fallback safe)
  renderVerse(verseEl, verse);
  renderQuote(quoteEl, quote);

  // Author Spotlight (Wikipedia summary) - richer attributes than the quote API
  const btn = quoteEl.querySelector(".author-spotlight-btn");
  const panel = quoteEl.querySelector("#author-spotlight");
  if (btn && panel) {
    btn.addEventListener("click", async () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        btn.setAttribute("aria-expanded", "false");
        panel.hidden = true;
        return;
      }

      btn.setAttribute("aria-expanded", "true");
      panel.hidden = false;

      const authorName = btn.dataset.author || "Unknown";

      // Cached results to avoid repeated API calls
      let info = authorCache.get(authorName);
      if (!info) {
        info = await getAuthorSummary(authorName);
        authorCache.set(authorName, info);
      }

      const details = panel.querySelector(".author-details");
      const avatar = panel.querySelector(".author-avatar");

      if (details) {
        details.innerHTML = `
          <p class="author-title"><strong>${info.title}</strong>${info.description ? ` — <span>${info.description}</span>` : ""}</p>
          <p class="author-extract">${info.extract}</p>
          ${info.url ? `<p class="author-link"><a href="${info.url}" target="_blank" rel="noopener noreferrer">Read more on Wikipedia</a></p>` : ""}
        `;
      }

      if (avatar) {
        avatar.classList.remove("loading");
        if (info.thumbnail) {
          avatar.innerHTML = `<img src="${info.thumbnail}" alt="Portrait of ${info.title}" loading="lazy" />`;
        } else {
          avatar.innerHTML = `<span class="avatar-fallback" aria-hidden="true">👤</span>`;
        }
      }
    });
  }
})();

// Handle journal form
document.getElementById("entry-form").addEventListener("submit", (e)=>{
  e.preventDefault();
  const title = document.getElementById("entry-title").value;
  const body  = document.getElementById("entry-body").value;
  const tags  = document.getElementById("entry-tags").value;

  addEntry({ title, body, tags });

  e.target.reset();
  showToast("Entry saved ✅");
  // jump to history to show result
  location.hash = "history";
});

// Initial route
route();
