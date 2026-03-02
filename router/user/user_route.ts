import user from "../../database/models/User";
import * as jwt from "jsonwebtoken";
require("dotenv").config();

class UserRoute {
  async Authorization(request: any, response: any) {
    try {
      const login_data = request.body;

      if (!login_data || !login_data.login || !login_data.password) {
        return response.status(400).json({
          success: false,
          error: "Login and password required",
        });
      }

      const login: string = login_data.login;
      const password: string = login_data.password;

      if (!login || !password) {
        return response.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      const user_from_db = await user.getUserByLogin(login);

      if (!user_from_db) {
        return response.status(400).json({
          success: false,
          error: "User not found",
        });
      }

      const password_validate = await user.validatePassword(
        password,
        user_from_db.password,
      );

      if (!password_validate) {
        return response.status(401).json({
          success: false,
          error: "Invalid password",
        });
      }

      console.log("4️⃣ Пароль верный, создаем токен");
      const payload = {
        login: login,
        rights: user_from_db.rights,
        organization: user_from_db.organization,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!!, {
        expiresIn: "23h",
      });

      return response.status(200).json({
        success: true,
        token: token,
        user: {
          login: user_from_db.login,
          rights: user_from_db.rights,
          organization: user_from_db.organization,
        },
      });
    } catch (error) {
      console.error("🔥 Критическая ошибка сервера:", error);
      return response.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}

const userRoute = new UserRoute();
export default userRoute;
