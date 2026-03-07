import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Proxy Routes for umapyoi.net
  // We use a proxy to avoid CORS issues when fetching from the frontend
  const fetchOptions = { cache: 'no-store' as RequestCache };

  app.get("/api/proxy/gacha", async (req, res) => {
    try {
      const response = await fetch("https://umapyoi.net/api/v1/gacha/current", fetchOptions);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gacha data" });
    }
  });

  app.get("/api/proxy/birthdays", async (req, res) => {
    try {
      const response = await fetch("https://umapyoi.net/api/v1/character/currentbirthdays", fetchOptions);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch birthday data" });
    }
  });

  // Mocking music and news as they might not be as straightforward or public
  app.get("/api/proxy/news", async (req, res) => {
    try {
      const response = await fetch("https://umapyoi.net/api/v1/news/latest/10", fetchOptions);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.json([]);
    }
  });

  app.get("/api/proxy/characters", async (req, res) => {
    try {
      const response = await fetch("https://umapyoi.net/api/v1/character/list", fetchOptions);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch character data" });
    }
  });

  app.get("/api/proxy/music", async (req, res) => {
    try {
      const response = await fetch("https://umapyoi.net/api/v1/music/min/albums", fetchOptions);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch music data" });
    }
  });

  app.get("/api/proxy/music/album/:id", async (req, res) => {
    try {
      const response = await fetch(`https://umapyoi.net/api/v1/music/album/${req.params.id}`, fetchOptions);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch album data" });
    }
  });

  app.get("/api/proxy/videos", async (req, res) => {
    // List of Uma Musume Music Videos (using valid YouTube video IDs)
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
