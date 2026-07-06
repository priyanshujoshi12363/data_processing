import mongoose from "mongoose";

const DatasetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    prompt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    schema: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    rows: {
      type: Number,
      required: true,
      min: 1,
      max: 100000,
    },

    mode: {
      type: String,
      enum: ["GENERATE", "SEARCH", "STRUCTURE"],
      default: "GENERATE",
    },

    inputData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    format: {
      type: String,
      enum: ["json", "csv", "txt", "jsonl", "rag", "md"],
      default: "json",
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    jobId: {
      type: String,
      default: null,
      index: true,
    },

    totalRowsGenerated: {
      type: Number,
      default: 0,
    },

    preview: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
      validate: {
        validator: (val: any[]) => val.length <= 50,
        message: "Preview too large",
      },
    },

    previewCount: {
      type: Number,
      default: 10,
    },

    resultUrl: {
      type: String,
      default: null,
    },

    error: {
      type: String,
      default: null,
    },

    creditsUsed: {
      type: Number,
      required: true,
      min: 0,
    },

    embeddings: {
      type: Boolean,
      default: false,
    },

    vectorDb: {
      type: String,
      enum: ["pinecone", "weaviate", "faiss"],
      default: null,
    },

    embeddingStatus: {
      type: String,
      enum: ["not_started", "processing", "completed", "failed"],
      default: "not_started",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

DatasetSchema.index({ userId: 1, createdAt: -1 });
DatasetSchema.index({ status: 1 });
DatasetSchema.index({ jobId: 1 });

export default mongoose.models.Dataset ||
  mongoose.model("Dataset", DatasetSchema);