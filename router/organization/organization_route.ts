import SensorService from "../../database/sensor_database";
import * as jwt from "jsonwebtoken";
import APIUtils from "../utils";
require("dotenv").config();

class OrganizationRoute {
  async getOrganizationEmployee(request: any, response: any) {
    const token = APIUtils.getToken(request);
    if (token != null) {
      const data: any = APIUtils.decodeToken(token);
      console.log(data);
      if (data != null) {
        try {
          const employee = await SensorService.getEmployeeList(
            data.organization,
          );
          console.log(employee);
          response.status(200).json({
            success: true,
            data: employee,
            count: employee.length,
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

const organizationRoute = new OrganizationRoute();
export default organizationRoute;
