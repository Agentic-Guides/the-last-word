// Cloudflare Pages Functions middleware
// Serves llms.txt as text/markdown when the client requests it via Accept negotiation.
export async function onRequest(context) {
  const { request, next } = context;
  const accept = request.headers.get("Accept") || "";

  // If the client asks for markdown, serve llms.txt as text/markdown
  if (accept.includes("text/markdown")) {
    try {
      const llms = await fetch(new URL("/llms.txt", request.url));
      if (llms.ok) {
        const body = await llms.text();
        return new Response(body, {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Vary": "Accept, Accept-Encoding",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    } catch (e) {
      // fall through to normal handling
    }
  }

  // Otherwise pass through to the static asset
  return next();
}
