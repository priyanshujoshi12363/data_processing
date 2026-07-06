import { connectDB } from "@/lib/DB";
import { adminAuth } from "@/lib/firebaseAdmin";
import User from "@/models/User";
import Dataset from "@/models/Dataset";

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "No token" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    await connectDB();

    const user = await User.findOne({ uid: decoded.uid });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    await Dataset.deleteMany({ userId: user._id });
    await User.deleteOne({ uid: decoded.uid });
    await adminAuth.deleteUser(decoded.uid);

    return Response.json({
      success: true,
      message: "Account deleted successfully",
    });

  } catch (error: any) {
    console.error("DELETE ACCOUNT ERROR:", error);

    return Response.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}