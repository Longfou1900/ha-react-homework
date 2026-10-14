export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/info") {
      const server =
        Math.floor(Date.now() / 1000) % 2 === 0
          ? "WEB-01"
          : "WEB-02";

      return Response.json({
        server,
        timestamp: new Date().toISOString()
      });
    }

    if (url.pathname === "/health") {
      return Response.json({
        status: "UP",
        server: "CLOUDFLARE-WORKER"
      });
    }

    return env.ASSETS.fetch(request);
  }
};
