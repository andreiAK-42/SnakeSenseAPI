import mongoose from "mongoose"

const settingsSchema = new mongoose.Schema({
  dht_temperature_add: { type: Number, default: 0 },
  dht_humidity_add: { type: Number, default: 0 },
  gas_au_add: { type: Number, default: 0 },
  place: { type: String, required: false },
});

const sensorSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    password: { type: String, required: true },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: { type: String, required: true },
    settings: { type: settingsSchema, default: {} },
    last_activity: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Sensor", sensorSchema);
