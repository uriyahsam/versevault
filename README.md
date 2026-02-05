# 📖 VerseVault

**VerseVault** is a daily Bible verse and inspirational journal web application.  
It provides fresh scripture, motivational quotes, and a focused writing environment for personal reflection — all in a clean, responsive, and accessible interface.

![VerseVault Screenshot](/src/images/site.png)

---

## ✨ Features

- 📜 **Daily Bible Verse** — fetched dynamically from the Bible API  
- 💡 **Daily Inspirational Quote** — fetched dynamically from the Quotes API  
- 👤 **Author Spotlight** — displays biography and image using the Wikipedia API  
- 📝 **Journal Focus Mode** — distraction-free writing environment  
- 🔢 **Word Count & Draft Auto-Save** — helps track and preserve writing progress  
- 💾 **Local Storage Support** — keeps journal entries private in the browser  
- 🌙 **Dark Mode Toggle** — accessible directly from the header  
- 📜 **Journal History** — view and manage saved reflections  
- 📱 **Responsive Design** — optimized for mobile, tablet, and desktop  
- 🎨 **Enhanced UI Effects** — hover animations, loading shimmer, and toast notifications  
- ⚡ **Fast and Lightweight** — built with Vite and vanilla JavaScript

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES Modules)  
- **Build Tool:** Vite  
- **APIs:**  
  - [Bible API](https://bible-api.com/) — daily scripture  
  - [RandomQuotes API](https://random-quotes-freeapi.vercel.app/api/random) — inspirational quotes  
  - [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) — author biography and images  
- **Storage:** Browser LocalStorage  
- **Hosting:** Netlify  
  - 🌐 [Live Site](https://us-versevault.netlify.app/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm

### Installation

```bash
git clone https://github.com/uriyahsam/versevault.git
cd versevault
npm install

npm run start ## To launch the site