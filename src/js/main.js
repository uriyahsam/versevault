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

  // If we switched to journal, restore draft + update word count
  if (active.id === "journal") {
    loadJournalDraft();
    document.getElementById("entry-body-journal")?.focus();
  }
}
window.addEventListener("hashchange", route);

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Dark mode
initDarkToggle(document.getElementById("dark-mode-toggle"));

// Draft support for Journal (focus mode)
const DRAFT_KEY = "vv-draft";
function countWords(text = "") {
  const t = String(text).trim();
  return t ? t.split(/\s+/).length : 0;
}
function updateJournalWordCount() {
  const textarea = document.getElementById("entry-body-journal");
  const out = document.getElementById("journal-word-count");
  if (!textarea || !out) return;
  out.textContent = `${countWords(textarea.value)} words`;
}
function loadJournalDraft() {
  const titleEl = document.getElementById("entry-title-journal");
  const bodyEl = document.getElementById("entry-body-journal");
  const tagsEl = document.getElementById("entry-tags-journal");
  if (!titleEl || !bodyEl || !tagsEl) return;

  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    const draft = JSON.parse(raw);
    titleEl.value = draft.title || "";
    bodyEl.value = draft.body || "";
    tagsEl.value = draft.tags || "";
  } catch {
    // ignore corrupted draft
  }

  updateJournalWordCount();
}
function saveJournalDraftDebounced() {
  window.clearTimeout(saveJournalDraftDebounced._t);
  saveJournalDraftDebounced._t = window.setTimeout(() => {
    const title = document.getElementById("entry-title-journal")?.value || "";
    const body = document.getElementById("entry-body-journal")?.value || "";
    const tags = document.getElementById("entry-tags-journal")?.value || "";
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, body, tags }));
  }, 250);
}

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

// Journal page (focus mode) form
const journalForm = document.getElementById("entry-form-journal");
if (journalForm) {
  const bodyEl = document.getElementById("entry-body-journal");
  const titleEl = document.getElementById("entry-title-journal");
  const tagsEl = document.getElementById("entry-tags-journal");

  const onDraftInput = () => {
    updateJournalWordCount();
    saveJournalDraftDebounced();
  };

  titleEl?.addEventListener("input", onDraftInput);
  bodyEl?.addEventListener("input", onDraftInput);
  tagsEl?.addEventListener("input", onDraftInput);

  const clearBtn = document.getElementById("clear-draft-btn");
  clearBtn?.addEventListener("click", () => {
    localStorage.removeItem(DRAFT_KEY);
    window.setTimeout(updateJournalWordCount, 0);
  });

  journalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = titleEl?.value || "";
    const body = bodyEl?.value || "";
    const tags = tagsEl?.value || "";

    addEntry({ title, body, tags });
    localStorage.removeItem(DRAFT_KEY);
    e.target.reset();
    updateJournalWordCount();
    showToast("Entry saved ✅");
  });
}

// Initial route
route();
