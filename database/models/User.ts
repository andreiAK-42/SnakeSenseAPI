import mongoose from "mongoose";
require("dotenv").config();
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  integration: [],
  rights: {
    type: String,
    enum: ["employee", "admin", "owner"],
    default: "employee",
  },
});

const User = mongoose.model("User", userSchema);

class UserService {
  isConnected: boolean;

  constructor() {
    this.isConnected = false;
    this.connect();
  }

  async connect() {
    if (this.isConnected) return;

    try {
      const MONGODB_URI = process.env.MONGODB_URI;
      if (MONGODB_URI) {
        await mongoose.connect(MONGODB_URI);
        this.isConnected = true;
        console.log("✅ MongoDB");
      } else {
        console.log("❌ MongoDB. Ошибка подключения");
      }
    } catch (error) {
      console.error("❌ MongoDB. Ошибка подключения", error);
      throw error;
    }
  }

  async getUserByLogin(login: string) {
    const user = await User.findOne({ login: login });

    if (user) {
      return user;
    } else {
      return null;
    }
  }

  async validatePassword(request_password: string, mongo_password: string) {
    return await bcrypt.compare(request_password, mongo_password);
  }

  async addNewUser(login: string, password: string, organization: string, rights: string) {
   const saltRounds = 10;
   const hash_password = await bcrypt.hash(password, saltRounds);
   
    await User.insertOne({
      login: login,
      password: hash_password,
      organization: new mongoose.Types.ObjectId(organization),
      rights: rights
    });
  }
}

const user = new UserService();
export default user;