import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
      immutable: true, 
      trim: true,
    },

    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"], // ✅ validation
    },

    image: {
      type: String,
      default: "",
    },

    credits: {
      type: Number,
      default: 100,
      min: 0, 
    },

    plan: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false, 
  }
);

UserSchema.index({ uid: 1 });
UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);