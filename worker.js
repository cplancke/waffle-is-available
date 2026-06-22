export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ✅ GET event data
    if (request.method === "GET" && url.pathname.startsWith("/event")) {
      const eventId = url.pathname.split("/")[2];

      const data = await env.MAGIC_KV.get(eventId);
      return new Response(data || "{}", {
        headers: { "Content-Type": "application/json" }
      });
    }

    // ✅ SAVE availability
    if (request.method === "POST" && url.pathname === "/save") {
      const body = await request.json();
      const { eventId, user, slots } = body;

      let existing = await env.MAGIC_KV.get(eventId);
      existing = existing ? JSON.parse(existing) : {};

      existing[user] = slots;

      await env.MAGIC_KV.put(eventId, JSON.stringify(existing));

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not found", { status: 404 });
  }
};
