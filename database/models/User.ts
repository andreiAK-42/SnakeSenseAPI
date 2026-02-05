import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  login: { type: String, required: true },
  password: [{ type: String }],
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  integration: [],
  rights: {
    type: String,
    enum: ["employee", "admin", "owner"],
    default: "employee",
  },
});

module.exports = mongoose.model("Organization", userSchema);
