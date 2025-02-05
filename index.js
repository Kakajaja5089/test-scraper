const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

app.get("/anilist/search", async (req, res) => {
    if (!req.query.q) return res.status(400).json({ error: "Missing query parameter 'q'" });
    const data = await getAnilistSearch(req.query.q);
    res.json(data);
});

app.get("/anilist/trending", async (_, res) => {
    const data = await getAnilistTrending();
    res.json(data);
});

app.get("/anilist/upcoming", async (_, res) => {
    const data = await getAnilistUpcoming(1);
    res.json(data);
});

app.get("/anilist/anime", async (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: "Missing query parameter 'id'" });
    const data = await getAnilistAnime(req.query.id);
    res.json(data);
});

// Example placeholders for AniWorld scraping
app.get("/aniworld/search", async (req, res) => {
    if (!req.query.q) return res.status(400).json({ error: "Missing query parameter 'q'" });
    res.json({ message: "Scraping logic for AniWorld search goes here." });
});

app.get("/aniworld/episodes", async (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: "Missing query parameter 'id'" });
    res.json({ message: "Scraping logic for AniWorld episodes goes here." });
});

// AniList Functions (Modified)
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

// Express.js export for Vercel
module.exports = app;
