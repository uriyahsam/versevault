const KEY = "vv-dark";

export function initDarkToggle(toggleEl){
  const saved = localStorage.getItem(KEY) === "1";
  document.documentElement.classList.toggle("dark", saved);
  toggleEl.checked = saved;

  toggleEl.addEventListener("change", ()=>{
    const on = toggleEl.checked;
    document.documentElement.classList.toggle("dark", on);
    localStorage.setItem(KEY, on ? "1" : "0");
  });
}
