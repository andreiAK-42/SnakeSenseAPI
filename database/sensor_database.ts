import mongoose from "mongoose";
const Organization = require("./models/Organization");
const Sensor = require("./models/Sensor");
const Measurement = require("./models/Measurement");
require("dotenv").config();

class SensorService {
  isConnected: boolean;
  
  constructor() {
    this.isConnected = false;
    this.connect();
  }

  async connect() {
    if (this.isConnected) return;

    try {
      const MONGODB_URI = process.env.MONGODB_URI;
      await mongoose.connect(MONGODB_URI);
      this.isConnected = true;
      console.log("✅ MongoDB");
    } catch (error) {
      console.error("❌ MongoDB. Ошибка подключения", error);
      throw error;
    }
  }
  async addMeasurement(
    sensorId,
    sensorPassword,
    dhtTemperature,
    dhtHumidity,
    bmpTemperature,
    bmpPressure,
    mq_au,
  ) {
    try {
      await this.connect();
      const measurement = new Measurement({
        sensor_id: sensorId,
        time: new Date(),
        data: {
          dht_temperature: dhtTemperature,
          dht_humidity: dhtHumidity,
          bmp_temperature: bmpTemperature,
          bmp_pressure: bmpPressure,
          mq_au: mq_au,
        },
      });

      await measurement.save();

      await Sensor.findByIdAndUpdate(sensorId, {
        last_activity: new Date(),
      });

      return measurement;
    } catch (error) {
      console.error("❌ Ошибка добавления замеров: ", error);
    }
  }

  async getMeasurement(sensorId: string, date_start, date_end) {
    try {
      await this.connect();
      const sensor = await Sensor.findOne({ _id: sensorId });

      if (!sensor) {
        console.error("❌ Неизвестный датчик: " + sensorId);
      }

      const startOfDay = new Date(date_start);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date_end);
      endOfDay.setDate(endOfDay.getDate() + 1);
      endOfDay.setHours(0, 0, 0, 0);

      const measurements = await Measurement.find(
        {
          sensor_id: sensorId,
          time: { $gte: new Date(startOfDay), $lt: new Date(endOfDay) },
        },
        { time: 1, data: 1 },
      ).sort({ time: 1 });

      return measurements;
    } catch (error) {
      console.error("❌ Ошибка получения замеров: ", error);
    }
  }

  async findSensorByIdAndPassword(sensorId, password) {
    try {
      const sensor = await Sensor.findOne({
        _id: sensorId,
        password: password,
      }).populate("organization", "name");

      return sensor;
    } catch (error) {
      console.error("❌ Ошибка получения датчика по логину и паролю: ", error);
    }
  }

  async getAllOrganizationSensors(organizationId) {
    try {
      await this.connect();
      const sonsors = await Sensor.find({
        organization: new mongoose.Types.ObjectId(organizationId),
      });

      return sonsors;
    } catch (error) {
      console.error("❌ Ошибка получения датчиков организации: ", error);
    }
  }

  async updateSensor(sensorId, updateData) {
    try {
      await this.connect();
      const sensor = await Sensor.findByIdAndUpdate(
        sensorId,
        { $set: updateData },
        { new: true, runValidators: true },
      );

      if (!sensor) {
        console.error("❌ Датчик не найден: ", sensorId);
      }

      return sensor;
    } catch (error) {
      console.error("❌ Ошибка обновления настроек датчика: ", error);
    }
  }

  async deleteSensor(sensorId) {
    try {
      await this.connect();
      const sensor = await Sensor.findByIdAndDelete(sensorId);

      if (!sensor) {
        console.error("❌ Датчик не найден: ", sensorId);
      }

      return sensor;
    } catch (error) {
      console.error("❌ Ошибка удаления датчика:", error);
    }
  }
}

module.exports = new SensorService();
