import * as jwt from "jsonwebtoken";

class APIUtils {
  getToken(request: any): string | null {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      return null
    }

    return authHeader.split(" ")[1]
  }

  decodeToken(token: string): string | jwt.JwtPayload | null {
    let decoded: any;
    try {
      return jwt.verify(token, process.env.JWT_SECRET_KEY!)
    } catch (err) {
      return null
    }
  }
}

const apiUtils = new APIUtils()
export default apiUtils
