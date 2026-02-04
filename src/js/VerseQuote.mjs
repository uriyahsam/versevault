export function renderVerse(target, data) {
  target.innerHTML = `
    <p class="verse-text">“${data.text}”</p>
    <p class="verse-meta">${data.reference} — <span>${data.translation}</span></p>
  `;
  target.classList.remove("loading");
}

export function renderQuote(target, data) {
  // Render quote + a button to fetch richer author info (Wikipedia summary API)
  target.innerHTML = `
    <p class="quote-text">“${data.text}”</p>
    <p class="quote-meta">— <span class="quote-author">${data.author}</span></p>

    <div class="quote-actions">
      <button type="button"
        class="author-spotlight-btn"
        data-author="${(data.author || "").replace(/"/g, "&quot;")}"
        aria-expanded="false"
        aria-controls="author-spotlight">
        Author Spotlight
      </button>
    </div>

    <div id="author-spotlight" class="author-spotlight" hidden>
      <div class="author-spotlight-inner">
        <div class="author-avatar loading" aria-hidden="true"></div>
        <div class="author-details">
          <p class="author-title loading">Loading author details…</p>
        </div>
      </div>
    </div>
  `;
  target.classList.remove("loading");
}
