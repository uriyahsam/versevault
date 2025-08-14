import { listEntries, deleteEntry, updateEntry } from "./Journal.mjs";

function fmt(ts){
  const d = new Date(ts);
  return d.toLocaleString();
}

export function renderEntryList(container){
  const entries = listEntries();
  if(!entries.length){
    container.innerHTML = `<p class="muted">No entries yet. Write your first reflection on the Home page.</p>`;
    return;
  }
  container.innerHTML = entries.map(e => `
    <div class="entry" data-id="${e.id}">
      <h3>${e.title || "(untitled)"}</h3>
      <p class="meta">Created: ${fmt(e.createdAt)} • Updated: ${fmt(e.updatedAt)}</p>
      ${e.tags?.length ? `<p class="meta">Tags: ${e.tags.join(", ")}</p>` : ""}
      <p>${e.body.replace(/\n/g, "<br/>")}</p>
      <div class="controls">
        <button data-edit>Edit</button>
        <button data-delete>Delete</button>
      </div>
    </div>
  `).join("");

  container.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", (e)=>{
      const id = e.currentTarget.closest(".entry").dataset.id;
      deleteEntry(id);
      renderEntryList(container);
    });
  });

  container.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", (e)=>{
      const wrap = e.currentTarget.closest(".entry");
      const id = wrap.dataset.id;
      const title = prompt("New title:", wrap.querySelector("h3").textContent) ?? "";
      const body = prompt("New body:", wrap.querySelector("p:not(.meta)").textContent) ?? "";
      updateEntry(id, { title, body });
      renderEntryList(container);
    });
  });
}
