export default {
  async fetch(request, env, ctx) {
    if (request.method === "POST" && new URL(request.url).pathname === "/upload") {
      const contentType = request.headers.get("Content-Type");
      const filename = request.headers.get("X-Filename") || "resume.pdf";
      const body = await request.arrayBuffer();

      await env.R2_BUCKET.put(filename, body, {
        httpMetadata: { contentType },
      });

      const publicUrl = `https://<your-r2-public-domain>/${filename}`; // Optional if public
      return new Response(JSON.stringify({ success: true, fileUrl: publicUrl }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};