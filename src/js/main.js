import { getDailyVerse, getDailyQuote } from "./api.mjs";
import { renderVerse, renderQuote } from "./VerseQuote.mjs";
import { addEntry } from "./Journal.mjs";
import { renderEntryList } from "./EntryList.mjs";
import { initDarkToggle } from "./Settings.mjs";

// Simple hash router to toggle .view sections
function route(){
  const hash = location.hash.replace("#","") || "home";
  document.querySelectorAll(".view").forEach(v => v.hidden = true);
  const active = document.getElementById(hash) || document.getElementById("home");
  active.hidden = false;

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
})();

// Handle journal form
document.getElementById("entry-form").addEventListener("submit", (e)=>{
  e.preventDefault();
  const title = document.getElementById("entry-title").value;
  const body  = document.getElementById("entry-body").value;
  const tags  = document.getElementById("entry-tags").value;

  addEntry({ title, body, tags });

  e.target.reset();
  // jump to history to show result
  location.hash = "history";
});

// Initial route
route();
