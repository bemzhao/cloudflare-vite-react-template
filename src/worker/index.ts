import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// GET /api/items — read all items from KV
app.get("/api/items", async (c) => {
  if (!c.env.MY_KV) {
    return c.json([]);
  }
  const raw = await c.env.MY_KV.get("items");
  if (!raw) {
    return c.json([]);
  }
  return c.json(JSON.parse(raw));
});

// POST /api/items/seed — populate KV with initial items
app.post("/api/items/seed", async (c) => {
  if (!c.env.MY_KV) {
    return c.json({ ok: false, error: "KV not available" }, 500);
  }
  const { items } = await c.req.json<{ items: string[] }>();
  await c.env.MY_KV.put("items", JSON.stringify(items));
  return c.json({ ok: true, count: items.length });
});

export default app;
