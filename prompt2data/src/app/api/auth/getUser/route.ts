import { connectDB } from "@/lib/DB";
import { adminAuth } from "@/lib/firebaseAdmin";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "No token" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];

    const decoded = await adminAuth.verifyIdToken(token);

    await connectDB();

    const user = await User.findOne({ uid: decoded.uid }).select("-__v");

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      user,
    });

  } catch (error: any) {
    console.error("GET USER ERROR:", error);

    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}