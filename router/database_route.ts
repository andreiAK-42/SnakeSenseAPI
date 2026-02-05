const SensorService = require("../database/sensor_database");

class DatabaseRoute {
  async addSensorMeasurements(request, response) {
    try {
      const {
        sensor_uid,
        sensor_password,
        dht_temperature,
        dht_humidity,
        bmp_pressure,
        bmp_temperature,
        mq_au,
      } = request.body;

      await SensorService.addMeasurement(
        sensor_uid,
        sensor_password,
        dht_temperature,
        dht_humidity,
        bmp_temperature,
        bmp_pressure,
        mq_au
      );
      response.status(200).end();
    } catch {
      response.status(404).end();
    }
  }

  async getSensorMeasurements(request, response) {
    try {
      const {
        sensor_uid = "GHJKOIUHN>:PMKL<MJ21447622",
        date_start,
        date_end,
      } = request.query;

      const measurements = await SensorService.getMeasurement(
        sensor_uid,
        date_start,
        date_end
      );

      response.status(200).json({
        success: true,
        data: measurements,
        count: measurements.length,
      });
    } catch (error) {
      console.error("Error in getSensorMeasurements:", error);
      response.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getAllOrganizationSensors(request, response) {
    const { organizationId } = request.query;
    
    try {
      const sensors = await SensorService.getAllOrganizationSensors(
        organizationId
      );

      response.status(200).json({
        success: true,
        data: sensors,
        count: sensors.length,
      });
    } catch (error) {
      console.error("Error in getAllOrganizationSensors:", error);
      response.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateSensor(request, response) {
    try {
      const { id } = request.params;
      const updateData = request.body;

      const sensor = await SensorService.updateSensor(id, updateData);

      response.status(200).json({
        success: true,
        data: sensor,
      });
    } catch (error) {
      console.error("Error in updateSensor:", error);
      response.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }

  async deleteSensor(request, response) {
    try {
      const { id } = request.params;

      await SensorService.deleteSensor(id);

      response.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error("Error in deleteSensor:", error);
      response.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new DatabaseRoute();
