import mongoose from "mongoose";

// Map to the shared "users" collection used by the customer app
const customerUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: 1 },
    password: { type: String, select: false },
    role: { type: String, default: "customer" },
    image: String,
    verified: { type: Boolean, default: false },
    active: { type: Boolean, default: true }, // <-- for deactivate/activate
  },
  { timestamps: true, collection: "users" }
);

export default mongoose.model("User", customerUserSchema);
