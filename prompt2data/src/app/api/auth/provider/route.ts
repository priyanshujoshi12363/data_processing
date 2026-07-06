
import { connectDB } from "@/lib/DB";
import { adminAuth } from "@/lib/firebaseAdmin";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return Response.json({ error: "No token" }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);

    const { uid, name, email, picture } = decoded;

    await connectDB();

    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        name: name || email?.split('@')[0] || 'User',
        email,
        image: picture || null,
        credits: 100,
        plan: "free",
        isActive: true,
        lastLogin: new Date(),
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    return Response.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("PROVIDER AUTH ERROR:", error);

    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}