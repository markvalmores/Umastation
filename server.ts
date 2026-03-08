import express from "express";
import path from "path";

const app = express();

// API Proxy Routes for umapyoi.net
// We use a proxy to avoid CORS issues when fetching from the frontend
const fetchOptions = { 
  cache: 'no-store' as RequestCache,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

app.get("/api/proxy/gacha", async (req, res) => {
  try {
    console.log("Fetching gacha data...");
    const response = await fetch("https://umapyoi.net/api/v1/gacha/current", fetchOptions);
    if (!response.ok) throw new Error(`Umapyoi API returned ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Gacha fetch error:", error);
    res.status(500).json({ error: "Failed to fetch gacha data", details: error instanceof Error ? error.message : String(error) });
  }
});

app.get("/api/proxy/birthdays", async (req, res) => {
  try {
    const response = await fetch("https://umapyoi.net/api/v1/character/currentbirthdays", fetchOptions);
    if (!response.ok) throw new Error(`Umapyoi API returned ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Birthday fetch error:", error);
    res.status(500).json({ error: "Failed to fetch birthday data" });
  }
});

app.get("/api/proxy/news", async (req, res) => {
  try {
    const response = await fetch("https://umapyoi.net/api/v1/news/latest/10", fetchOptions);
    if (!response.ok) throw new Error(`Umapyoi API returned ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("News fetch error:", error);
    res.json([]);
  }
});

app.get("/api/proxy/characters", async (req, res) => {
  try {
    const response = await fetch("https://umapyoi.net/api/v1/character/list", fetchOptions);
    if (!response.ok) throw new Error(`Umapyoi API returned ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Characters fetch error:", error);
    res.status(500).json({ error: "Failed to fetch character data" });
  }
});

app.get("/api/proxy/music", async (req, res) => {
  try {
    const response = await fetch("https://umapyoi.net/api/v1/music/min/albums", fetchOptions);
    if (!response.ok) throw new Error(`Umapyoi API returned ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Music fetch error:", error);
    res.status(500).json({ error: "Failed to fetch music data" });
  }
});

app.get("/api/proxy/music/album/:id", async (req, res) => {
  try {
    const response = await fetch(`https://umapyoi.net/api/v1/music/album/${req.params.id}`, fetchOptions);
    if (!response.ok) throw new Error(`Umapyoi API returned ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Album fetch error:", error);
    res.status(500).json({ error: "Failed to fetch album data" });
  }
});

app.get("/api/proxy/videos", async (req, res) => {
  const musicVideos = [
    { id: 'Y-G7nP9C6-Q', title: 'Umapyoi Densetsu (MV)', category: 'Music Video' },
    { id: '6y3-z8k9vA0', title: 'GIRLS\' LEGEND U (MV)', category: 'Music Video' },
    { id: 'RKVWLnVqnP0', title: '1st Anniversary Special Animation', category: 'Music Video' },
    { id: 'ypyxHnnBKLo', title: 'Bourbon and the Computer', category: 'Music Video' },
    { id: '4dKz3gB1b-0', title: 'UmaYuru Episode 24', category: 'Music Video' },
    { id: 'M3-e1U5d7qI', title: 'UmaYuru Episode 23', category: 'Music Video' },
    { id: '6vYy3p9Q8vA', title: 'UmaYuru Episode 22', category: 'Music Video' },
    { id: '1zK3x8Q9vA0', title: 'UmaYuru Episode 21', category: 'Music Video' },
    { id: 'wXyZ1a2b3c4', title: 'DRAMATIC JOURNEY (MV)', category: 'Music Video' },
    { id: 'd5e6f7g8h9i', title: 'We are DREAMERS!! (MV)', category: 'Music Video' }
  ];
  res.json(musicVideos);
});

async function setupServer() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

setupServer();

export default app;
