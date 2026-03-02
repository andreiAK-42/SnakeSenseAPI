import SensorService from "../../database/sensor_database";
import {sendFormattedMessage} from '../../telegram/telegram_sender'
require("dotenv").config();

class MeasurementRoute {
  async addSensorMeasurements(request: any, response: any) {
    try {
      const {
        sensor_uid,
        sensor_password,
        dht_temperature,
        dht_humidity,
        gas_au,
      } = request.body;

      await SensorService.addMeasurement(
        sensor_uid,
        sensor_password,
        dht_temperature,
        dht_humidity,
        gas_au,
      );

      await sendFormattedMessage("Нарушение", dht_temperature, dht_humidity, gas_au, "Нарушение температурного режима");

      response.status(200).end();
    } catch {
      response.status(404).end();
    }
  }

  async getSensorMeasurements(request: any, response: any) {
    try {
      const {
        sensor_uid = "GHJKOIUHN>:PMKL<MJ21447622",
        date_start,
        date_end,
      } = request.query;

      const measurements = await SensorService.getMeasurement(
        sensor_uid,
        date_start,
        date_end,
      );

      response.status(200).json({
        success: true,
        data: measurements,
        count: measurements.length,
      });
    } catch (error: any) {
      console.error("Error in getSensorMeasurements:", error);
      response.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }
}

const measurementRoute = new MeasurementRoute();
export default measurementRoute;
