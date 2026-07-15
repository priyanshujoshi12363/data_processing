import { connectDB } from "@/lib/DB";
import { adminAuth } from "@/lib/firebaseAdmin";
import User from "@/models/User";

export const runtime = "nodejs";
export const maxDuration = 300;

const PYTHON_API_URL =
  process.env.PYTHON_API_URL || "https://data-processing-n3kq.onrender.com";
const FORWARD_HEADERS = [
  "content-disposition",
  "content-type",
  "x-clean-stats",
  "x-detected-format",
  "x-credits-used",
  "x-credits-remaining",
];

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "No token" }, { status: 401 });
  }
  const token = authHeader.split("Bearer ")[1];

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findOne({ uid: decoded.uid });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const incoming = await req.formData();
  const file = incoming.get("file");
  const prompt = incoming.get("prompt") ?? "";

  if (!(file instanceof File)) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  const forward = new FormData();
  forward.append("userId", user._id.toString());
  forward.append("file", file, file.name);
  forward.append("prompt", String(prompt));

  let backendRes: Response;
  try {
    backendRes = await fetch(`${PYTHON_API_URL}/clean`, {
      method: "POST",
      body: forward,
    });
  } catch {
    return Response.json(
      { error: "Cleaning service is unreachable. Is the Python backend running?" },
      { status: 502 }
    );
  }

  const headers = new Headers();
  for (const name of FORWARD_HEADERS) {
    const value = backendRes.headers.get(name);
    if (value) headers.set(name, value);
  }

  return new Response(backendRes.body, {
    status: backendRes.status,
    headers,
  });
}
