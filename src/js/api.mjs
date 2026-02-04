/**
 * API helpers with graceful fallbacks if the remote service blocks CORS or rate-limits.
 * Bible: https://bible-api.com/data/web/random
 * Quotes: https://random-quotes-freeapi.vercel.app/api/random (Random Quotes API)
 */

async function safeJsonFetch(url, fallback) {
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Bad response: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Fetch failed, using fallback for:", url, err.message);
    return fallback;
  }
}

export async function getDailyVerse() {
  const url = `https://bible-api.com/data/web/random`;
  const data = await safeJsonFetch(url, {
    random_verse: {
      book: "John",
      chapter: 3,
      verse: 16,
      text: "For God so loved the world that he gave his one and only Son..."
    },
    translation: {
      name: "World English Bible"
    }
  });

  if (data && data.random_verse) {
    const verseData = data.random_verse;
    const translationName = data.translation?.name || "Unknown";
    
    // Construct the reference string
    const reference = `${verseData.book} ${verseData.chapter}:${verseData.verse}`;

    return {
      reference: reference,
      translation: translationName,
      text: verseData.text.trim(),
    };
  }
  return {
    reference: "John 3:16",
    translation: "Unknown",
    text: "Scripture unavailable.",
  };
}

export async function getDailyQuote() {
  const url = "https://random-quotes-freeapi.vercel.app/api/random";
  const data = await safeJsonFetch(url, {
    quote: "Be a light. Keep going.", // Fallback property for the API
    author: "Unknown"
  });

  return {
    text: data.quote ?? "Be a light. Keep going.",
    author: data.author ?? "Unknown",
  };
}

export async function getAuthorSummary(authorName) {
  const name = (authorName || "").trim();
  if (!name || name.toLowerCase() === "unknown") {
    return {
      title: "Unknown",
      description: "Author information unavailable.",
      extract: "No author details found for this quote.",
      thumbnail: null,
      url: null,
    };
  }

  // Wikipedia REST Summary endpoint
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;

  const data = await safeJsonFetch(url, {
    title: name,
    description: "Author information unavailable.",
    extract: "No author details found for this quote.",
    thumbnail: null,
    content_urls: null,
  });

  return {
    title: data.title || name,
    description: data.description || "",
    extract: data.extract || "No author details found for this quote.",
    thumbnail: data.thumbnail?.source || null,
    url: data.content_urls?.desktop?.page || null,
  };
}
