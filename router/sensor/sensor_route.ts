import SensorService from "../../database/sensor_database";
import * as jwt from "jsonwebtoken";
import APIUtils from "../utils";
require("dotenv").config();

class SensorRoute {
  async getAllOrganizationSensors(request: any, response: any) {
    const token = APIUtils.getToken(request);

    if (token != null) {
      const data: any = APIUtils.decodeToken(token);

      if (data != null) {
        try {
          const sensors = await SensorService.getAllOrganizationSensors(
            data.organization,
          );

          response.status(200).json({
            success: true,
            data: sensors,
            count: sensors.length,
          });
        } catch (error: any) {
          console.error("Error in getAllOrganizationSensors:", error);
          response.status(404).json({
            success: false,
            error: error.message,
          });
        }
      }
    }
  }
}

const sensorRoute = new SensorRoute();
export default sensorRoute;
