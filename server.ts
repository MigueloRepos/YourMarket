import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { db } from './src/db/index.ts';
import { users, products } from './src/db/schema.ts';
import { eq } from 'drizzle-orm';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const allProducts = await db.select().from(products);
      res.json(allProducts);
    } catch (error) {
      console.error("Database query failed:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // User sync/register route
  app.post("/api/users/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email, name, picture } = req.user!;
      
      const result = await db.insert(users)
        .values({
          uid,
          email: email || '',
          name: name || '',
          avatarUrl: picture || '',
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            email: email || '',
            name: name || '',
            avatarUrl: picture || '',
          },
        })
        .returning();

      res.json(result[0]);
    } catch (error) {
      console.error("Database query failed:", error);
      res.status(500).json({ error: "Failed to sync user" });
    }
  });

  // Get current user profile
  app.get("/api/users/me", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid } = req.user!;
      const userList = await db.select().from(users).where(eq(users.uid, uid));
      if (userList.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(userList[0]);
    } catch (error) {
      console.error("Database query failed:", error);
      res.status(500).json({ error: "Failed to get user profile" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
