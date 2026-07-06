// src/app/api/auth/verify/route.ts
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return Response.json({ error: "No token" }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);

    return Response.json({
      success: true,
      uid: decoded.uid,
    });

  } catch (error) {
    return Response.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}