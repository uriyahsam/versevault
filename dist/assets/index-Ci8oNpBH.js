(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function e(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=e(o);fetch(o.href,a)}})();async function p(n,t){try{const e=await fetch(n,{headers:{Accept:"application/json"}});if(!e.ok)throw new Error(`Bad response: ${e.status}`);return await e.json()}catch(e){return console.warn("Fetch failed, using fallback for:",n,e.message),t}}async function L(){const t=await p("https://bible-api.com/data/web/random",{random_verse:{book:"John",chapter:3,verse:16,text:"For God so loved the world that he gave his one and only Son..."},translation:{name:"World English Bible"}});if(t&&t.random_verse){const e=t.random_verse,r=t.translation?.name||"Unknown";return{reference:`${e.book} ${e.chapter}:${e.verse}`,translation:r,text:e.text.trim()}}return{reference:"John 3:16",translation:"Unknown",text:"Scripture unavailable."}}async function $(){const t=await p("https://random-quotes-freeapi.vercel.app/api/random",{quote:"Be a light. Keep going.",author:"Unknown"});return{text:t.quote??"Be a light. Keep going.",author:t.author??"Unknown"}}async function q(n){const t=(n||"").trim();if(!t||t.toLowerCase()==="unknown")return{title:"Unknown",description:"Author information unavailable.",extract:"No author details found for this quote.",thumbnail:null,url:null};const e=`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`,r=await p(e,{title:t,description:"Author information unavailable.",extract:"No author details found for this quote.",thumbnail:null,content_urls:null});return{title:r.title||t,description:r.description||"",extract:r.extract||"No author details found for this quote.",thumbnail:r.thumbnail?.source||null,url:r.content_urls?.desktop?.page||null}}function x(n,t){n.innerHTML=`
    <p class="verse-text">“${t.text}”</p>
    <p class="verse-meta">${t.reference} — <span>${t.translation}</span></p>
  `,n.classList.remove("loading")}function k(n,t){n.innerHTML=`
    <p class="quote-text">“${t.text}”</p>
    <p class="quote-meta">— <span class="quote-author">${t.author}</span></p>

    <div class="quote-actions">
      <button type="button"
        class="author-spotlight-btn"
        data-author="${(t.author||"").replace(/"/g,"&quot;")}"
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
  `,n.classList.remove("loading")}const b="vv-journal";function c(){try{return JSON.parse(localStorage.getItem(b))??[]}catch{return[]}}function m(n){localStorage.setItem(b,JSON.stringify(n))}function A(){return c().sort((n,t)=>t.createdAt-n.createdAt)}function S({title:n,body:t,tags:e}){const r={id:crypto.randomUUID(),title:n.trim(),body:t.trim(),tags:e.split(",").map(a=>a.trim()).filter(Boolean),createdAt:Date.now(),updatedAt:Date.now()},o=c();return o.push(r),m(o),r}function I(n,t){const e=c(),r=e.findIndex(o=>o.id===n);return r===-1?null:(e[r]={...e[r],...t,updatedAt:Date.now()},m(e),e[r])}function B(n){m(c().filter(t=>t.id!==n))}function y(n){return new Date(n).toLocaleString()}function u(n){const t=A();if(!t.length){n.innerHTML='<p class="muted">No entries yet. Write your first reflection on the Home page.</p>';return}n.innerHTML=t.map(e=>`
    <div class="entry" data-id="${e.id}">
      <h3>${e.title||"(untitled)"}</h3>
      <p class="meta">Created: ${y(e.createdAt)} • Updated: ${y(e.updatedAt)}</p>
      ${e.tags?.length?`<p class="meta">Tags: ${e.tags.join(", ")}</p>`:""}
      <p>${e.body.replace(/\n/g,"<br/>")}</p>
      <div class="controls">
        <button data-edit>Edit</button>
        <button data-delete>Delete</button>
      </div>
    </div>
  `).join(""),n.querySelectorAll("[data-delete]").forEach(e=>{e.addEventListener("click",r=>{const o=r.currentTarget.closest(".entry").dataset.id;B(o),u(n)})}),n.querySelectorAll("[data-edit]").forEach(e=>{e.addEventListener("click",r=>{const o=r.currentTarget.closest(".entry"),a=o.dataset.id,i=prompt("New title:",o.querySelector("h3").textContent)??"",f=prompt("New body:",o.querySelector("p:not(.meta)").textContent)??"";I(a,{title:i,body:f}),u(n)})})}const v="vv-dark";function T(n){const t=localStorage.getItem(v)==="1";document.documentElement.classList.toggle("dark",t),n.checked=t,n.addEventListener("change",()=>{const e=n.checked;document.documentElement.classList.toggle("dark",e),localStorage.setItem(v,e?"1":"0")})}const w=new Map;function h(n){const t=document.getElementById("toast");t&&(t.textContent=n,t.classList.add("show"),window.clearTimeout(h._t),h._t=window.setTimeout(()=>t.classList.remove("show"),2200))}function E(){const n=location.hash.replace("#","")||"home";document.querySelectorAll(".view").forEach(e=>e.hidden=!0);const t=document.getElementById(n)||document.getElementById("home");if(t.hidden=!1,t.classList.remove("fade-in"),t.offsetWidth,t.classList.add("fade-in"),t.id==="history"){const e=document.getElementById("entry-list");u(e)}}window.addEventListener("hashchange",E);document.getElementById("year").textContent=new Date().getFullYear();T(document.getElementById("dark-mode-toggle"));(async function(){const t=document.getElementById("daily-verse"),e=document.getElementById("daily-quote"),r=await L(),o=await $();x(t,r),k(e,o);const a=e.querySelector(".author-spotlight-btn"),i=e.querySelector("#author-spotlight");a&&i&&a.addEventListener("click",async()=>{if(a.getAttribute("aria-expanded")==="true"){a.setAttribute("aria-expanded","false"),i.hidden=!0;return}a.setAttribute("aria-expanded","true"),i.hidden=!1;const d=a.dataset.author||"Unknown";let s=w.get(d);s||(s=await q(d),w.set(d,s));const g=i.querySelector(".author-details"),l=i.querySelector(".author-avatar");g&&(g.innerHTML=`
          <p class="author-title"><strong>${s.title}</strong>${s.description?` — <span>${s.description}</span>`:""}</p>
          <p class="author-extract">${s.extract}</p>
          ${s.url?`<p class="author-link"><a href="${s.url}" target="_blank" rel="noopener noreferrer">Read more on Wikipedia</a></p>`:""}
        `),l&&(l.classList.remove("loading"),s.thumbnail?l.innerHTML=`<img src="${s.thumbnail}" alt="Portrait of ${s.title}" loading="lazy" />`:l.innerHTML='<span class="avatar-fallback" aria-hidden="true">👤</span>')})})();document.getElementById("entry-form").addEventListener("submit",n=>{n.preventDefault();const t=document.getElementById("entry-title").value,e=document.getElementById("entry-body").value,r=document.getElementById("entry-tags").value;S({title:t,body:e,tags:r}),n.target.reset(),h("Entry saved ✅"),location.hash="history"});E();
