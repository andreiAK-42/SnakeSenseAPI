const mongoose = require("mongoose");
const Organization = require("./models/Organization");
const Sensor = require("./models/Sensor");
import UserService from "./models/User";
const Measurement = require("./models/Measurement");
require("dotenv").config();

class DatabaseInitializer {
  organizations: any[];
  sensors: any[];
  constructor() {
    this.organizations = [];
    this.sensors = [];
  }

  async connect() {
    try {
      const MONGODB_URI = "mongodb://localhost:27017/SnakeSense";

      await mongoose.connect(MONGODB_URI);

      console.log("✅ MongoDB");

      await this.clearDatabase();
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1);
    }
  }

  async clearDatabase() {
    try {
      console.log(Organization.find());
      await Organization.deleteMany({});
      await Sensor.deleteMany({});
      await Measurement.deleteMany({});
      console.log("🗑️  Database cleared");
    } catch (error) {
      console.error("Error clearing database:", error);
    }
  }

  async createOrganizations() {
    const organizationsData = [
      {
        name: "ФГБОУ ВО Кемеровский Государственный Университет",
        api_keys: ["uioi;lmnhy789iol", "2354trhgfvdsasdfsdvbnghjkyi"],
        employees: [
          {
            first_name: "Андрей",
            last_name: "Корбань",
            position: "Разработчик",
            integrations: { telegram_id: 1429506743 },
          },
        ],
        phone: "+7 (495) 123-45-67",
        address: {
          city: "Кемерово",
          street: "Ленина",
          number: "15",
        },
        status: "active",
      },
    ];

    try {
      this.organizations = await Organization.insertMany(organizationsData);
      console.log(`✅ Created ${this.organizations.length} organizations`);
    } catch (error) {
      console.error("Error creating organizations:", error);
    }
  }

  async createSensors() {
    if (this.organizations.length === 0) {
      console.log("❌ No organizations found. Create organizations first.");
      return;
    }

    const sensorsData = [
      {
        _id: "GHJKOIUHN>:PMKL<MJ21447622",
        password: "56uyjhghg",
        organization: this.organizations[0]._id,
        name: "Вояджер 1",
        settings: {
          dht_temperature_add: 0,
          dht_humidity_add: 0,
          gas_au: 0,
          place: "Комната 525",
        },
      },
    ];

    try {
      this.sensors = await Sensor.insertMany(sensorsData);
      console.log(`✅ Created ${this.sensors.length} sensors`);
    } catch (error) {
      console.error("Error creating sensors:", error);
    }
  }

  async createUser() {
    if (this.organizations.length === 0) {
      console.log("❌ No organizations found. Create organizations first.");
      return;
    }

    try {
      await UserService.addNewUser(
        "xlebyshek",
        "12345",
        this.organizations[0]._id,
        "owner",
      );
      console.log(`✅ Created ${this.sensors.length} sensors`);
    } catch (error) {
      console.error("Error creating sensors:", error);
    }
  }

  async initialize() {
    console.log("🚀 Starting database initialization...");

    await this.connect();
    await this.createOrganizations();
    await this.createSensors();
    await this.createUser();

    mongoose.connection.close();
  }
}

if (require.main === module) {
  const initializer = new DatabaseInitializer();
  initializer.initialize().catch(console.error);
}

module.exports = DatabaseInitializer;
