export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;
        const params = Object.fromEntries(url.searchParams.entries());

        if (path.startsWith("/anilist/search")) {
            return new Response(JSON.stringify(await getAnilistSearch(params.q)), { headers: { "Content-Type": "application/json" } });
        }
        if (path.startsWith("/anilist/trending")) {
            return new Response(JSON.stringify(await getAnilistTrending()), { headers: { "Content-Type": "application/json" } });
        }
        if (path.startsWith("/anilist/upcoming")) {
            return new Response(JSON.stringify(await getAnilistUpcoming(1)), { headers: { "Content-Type": "application/json" } });
        }
        if (path.startsWith("/anilist/anime")) {
            return new Response(JSON.stringify(await getAnilistAnime(params.id)), { headers: { "Content-Type": "application/json" } });
        }
        if (path.startsWith("/aniworld/search")) {
            return new Response(JSON.stringify(await scrapeAniWorldSearch(params.q)), { headers: { "Content-Type": "application/json" } });
        }
        if (path.startsWith("/aniworld/episodes")) {
            return new Response(JSON.stringify(await scrapeAniWorldEpisodes(params.id)), { headers: { "Content-Type": "application/json" } });
        }

        return new Response("Invalid endpoint", { status: 404 });
    }
};

// --- Anilist Functions (Your provided code) ---
async function fetchAniList(query) {
    const url = "https://graphql.anilist.co";
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query }),
    };
    const res = await fetch(url, options);
    return res.json();
}

async function getAnilistSearch(q) {
    const query = anilistSearchQuery(q, 1, 10);
    const data = await fetchAniList(query);
    return data.data.Page.media;
}

async function getAnilistTrending() {
    const query = anilistTrendingQuery();
    const data = await fetchAniList(query);
    return data.data.Page.media;
}

async function getAnilistUpcoming(page) {
    const query = anilistUpcomingQuery(page);
    const data = await fetchAniList(query);
    return data.data.Page.airingSchedules;
}

async function getAnilistAnime(id) {
    const query = anilistMediaDetailQuery(id);
    const data = await fetchAniList(query);
    return data.data.Media;
}

// --- AniWorld Scraping Functions ---
async function scrapeAniWorldSearch(query) {
    const url = `https://aniworld.to/search?keyword=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const text = await response.text();
    
    // Use Cheerio or regex to extract anime search results
    return { message: "Scraping logic needed here." };
}

async function scrapeAniWorldEpisodes(id) {
    const url = `https://aniworld.to/anime/${id}`;
    const response = await fetch(url);
    const text = await response.text();

    // Extract episode links (VOE, Vidoza, etc.)
    return { message: "Scraping logic needed here." };
}
