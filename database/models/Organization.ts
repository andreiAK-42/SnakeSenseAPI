import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  city: { type: String, required: true },
  street: { type: String, required: true },
  number: { type: String, required: true },
});

const integrationsSchema = new mongoose.Schema({
  telegram_id: { type: String, required: false },
});

const employeeSchema = new mongoose.Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
  integrations: { type: integrationsSchema, required: true },
});

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    api_keys: [{ type: String }],
    employees: [{ type: employeeSchema }],
    phone: { type: String },
    address: { type: addressSchema, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Organization", organizationSchema);
