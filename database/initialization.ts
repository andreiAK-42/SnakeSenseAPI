const mongoose = require("mongoose");
const Organization = require("./models/Organization");
const Sensor = require("./models/Sensor");
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
      const MONGODB_URI = process.env.MONGODB_URI;

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
            login: "test",
            password: "test",
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

      this.organizations.forEach((org) => {
        console.log(`   - ${org.name} (ID: ${org._id})`);
      });
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
          bmp_temperature_add: 0,
          bmp_pressure_add: 0,
          mq_ppm_add: 0,
          place: "Комната 525",
        },
      },
    ];

    try {
      this.sensors = await Sensor.insertMany(sensorsData);
      console.log(`✅ Created ${this.sensors.length} sensors`);

      this.sensors.forEach((sensor) => {
        console.log(`   - ${sensor.name} (ID: ${sensor._id})`);
      });
    } catch (error) {
      console.error("Error creating sensors:", error);
    }
  }

  async initialize() {
    console.log("🚀 Starting database initialization...");

    await this.connect();
    await this.createOrganizations();
    await this.createSensors();

    console.log("🎉 Database initialization completed!");
    console.log("\n📊 Summary:");
    console.log(`   - Organizations: ${this.organizations.length}`);
    console.log(`   - Sensors: ${this.sensors.length}`);

    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
}

if (require.main === module) {
  const initializer = new DatabaseInitializer();
  initializer.initialize().catch(console.error);
}

module.exports = DatabaseInitializer;
