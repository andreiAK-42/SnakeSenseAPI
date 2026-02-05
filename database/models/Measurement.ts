import mongoose from "mongoose"

const dataSchema = new mongoose.Schema({
  dht_temperature: { type: Number },
  dht_humidity: { type: Number },
  bmp_temperature: { type: Number },
  bmp_pressure: { type: Number },
  mq_au: { type: Number },
});

const measurementSchema = new mongoose.Schema(
  {
    sensor_id: {
      type: String,
      ref: "Sensor",
      required: true,
    },
    time: { type: Date, default: Date.now },
    data: { type: dataSchema },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Measurement", measurementSchema);
