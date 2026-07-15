export const runtime = "nodejs";

const PYTHON_API_URL =
  process.env.PYTHON_API_URL || "https://data-processing-n3kq.onrender.com";

export async function GET() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  let awake = false;
  try {
    const res = await fetch(`${PYTHON_API_URL}/health`, {
      signal: controller.signal,
      cache: "no-store",
    });
    awake = res.ok;
  } catch {
    // Backend was asleep — the request already reached Render and triggered the
    // cold start, which is all we need. Aborting our wait is fine.
  } finally {
    clearTimeout(timer);
  }

  return Response.json({ status: awake ? "awake" : "waking" });
}
