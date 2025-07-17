import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["admin"], default: "admin" },

    fName: { type: String, required: true },
    lName: { type: String, required: true },

    email: { type: String, required: true, unique: true, index: 1 },
    password: { type: String, required: true },

    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, required: true },

    refreshJWT: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("AdminUser", userSchema);
