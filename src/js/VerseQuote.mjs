export function renderVerse(target, data) {
  target.innerHTML = `
    <p class="verse-text">“${data.text}”</p>
    <p class="verse-meta">${data.reference} — <span>${data.translation}</span></p>
  `;
  target.classList.remove("loading");
}
export function renderQuote(target, data) {
  target.innerHTML = `
    <p class="quote-text">“${data.text}”</p>
    <p class="quote-meta">— ${data.author}</p>
  `;
  target.classList.remove("loading");
}
