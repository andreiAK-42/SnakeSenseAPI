import express from "express";
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

import userRoute from "./router/user/user_route";
import sensorRoute from "./router/sensor/sensor_route";
import measurementRoute from "./router/measurement/measurement_route";
import organizationRoute from "./router/organization/organization_route";

require("dotenv").config();

const app = express();
const PORT = 3007;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/api/v1/ping", function (req, res) { res.status(200).send("Pong") });

app.post("/api/v1/auth/login", userRoute.Authorization);
app.get("/api/v1/sensors", sensorRoute.getAllOrganizationSensors);
app.post("/api/v1/measurement", measurementRoute.addSensorMeasurements);
app.get("/api/v1/measurement", measurementRoute.getSensorMeasurements);

app.get("/api/v1/employee", organizationRoute.getOrganizationEmployee);

app.listen(PORT, () => {
  console.log(`Сервер работает на http://localhost:${PORT}`);
});
