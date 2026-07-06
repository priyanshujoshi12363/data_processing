import { connectDB } from "@/lib/DB";
import { adminAuth } from "@/lib/firebaseAdmin";
import User from "@/models/User";
import Dataset from "@/models/Dataset";

export async function POST(req: Request) {
  try {
    // 🔐 1. VERIFY TOKEN
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    // 📦 2. GET INPUT
    const { prompt, schema, rows, format } = await req.json();

    if (!prompt || !rows) {
      return Response.json(
        { error: "Prompt and rows are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 👤 3. FIND USER
    const user = await User.findOne({ uid: decoded.uid });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // 🤖 4. CALL PYTHON AI
    const aiRes = await fetch("http://127.0.0.1:8000/generate-preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        schema,
        rows,
        format,
      }),
    });

    if (!aiRes.ok) {
      throw new Error("AI preview service failed");
    }

    const aiData = await aiRes.json();

    const preview = aiData.preview || [];
    const mode = aiData.mode || "GENERATE";
    const jobId = aiData.jobId || null;

    // 🧹 CLEAN DATA (important)
    const cleanedPreview = preview.map((row: any) => {
      const newRow: any = {};
      for (const key in row) {
        newRow[key] =
          row[key] === "Not specified" ? null : row[key];
      }
      return newRow;
    });

    // 💾 5. SAVE DATASET
    const dataset = await Dataset.create({
      userId: user._id,

      prompt,
      schema: schema || null,
      rows,

      mode,
      format: format || "json",

      status: "completed",
      progress: 100,
      totalRowsGenerated: cleanedPreview.length,

      preview: cleanedPreview,
      previewCount: cleanedPreview.length,

      jobId, // 🔥 future use

      creditsUsed: 0,

      embeddings: false,
      embeddingStatus: "not_started",
    });

    // 📤 6. RESPONSE
    return Response.json({
      success: true,
      datasetId: dataset._id,
      mode,
      jobId,
      preview: cleanedPreview,
    });

  } catch (error: any) {
    console.error("PREVIEW API ERROR:", error);

    return Response.json(
      { error: error.message || "Preview failed" },
      { status: 500 }
    );
  }
}