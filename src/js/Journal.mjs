const KEY = "vv-journal";

function readAll() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
  catch { return []; }
}
function writeAll(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function listEntries() {
  // newest first
  return readAll().sort((a, b) => b.createdAt - a.createdAt);
}
export function addEntry({ title, body, tags }) {
  const entry = {
    id: crypto.randomUUID(),
    title: title.trim(),
    body: body.trim(),
    tags: tags.split(",").map(t => t.trim()).filter(Boolean),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const all = readAll();
  all.push(entry);
  writeAll(all);
  return entry;
}
export function updateEntry(id, updates) {
  const all = readAll();
  const i = all.findIndex(e => e.id === id);
  if (i === -1) return null;
  all[i] = { ...all[i], ...updates, updatedAt: Date.now() };
  writeAll(all);
  return all[i];
}
export function deleteEntry(id) {
  writeAll(readAll().filter(e => e.id !== id));
}
