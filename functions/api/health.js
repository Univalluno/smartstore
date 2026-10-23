
export async function onRequest() {
  return Response.json({
    ok: true,
    server: "up",
    platform: "cloudflare-pages"
  });
}
