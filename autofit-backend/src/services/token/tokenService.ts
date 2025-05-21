import jwt, { SignOptions, JwtPayload, VerifyOptions } from "jsonwebtoken";

export class TokenService {
  private jwtSecret: string;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    this.jwtSecret = process.env.JWT_SECRET;
  }

  generateToken(payload: object, expiresIn: `${number}${'s' | 'm' | 'h' | 'd'}` = "60m"): string {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, this.jwtSecret, options);
  }

  verifyToken(token: string, ignoreExpiration: boolean = false): JwtPayload {
    const options: VerifyOptions = { ignoreExpiration };
    const decoded = jwt.verify(token, this.jwtSecret, options);
    if (typeof decoded === "string") {
      throw new Error("Invalid token payload");
    }
    return decoded as JwtPayload;
  }

  generateAccessToken(payload: object): string {
    const options: SignOptions = { expiresIn: "60m" };
    return jwt.sign(payload, this.jwtSecret, options);
  }

  generateRefreshToken(payload: object): string {
    const options: SignOptions = { expiresIn: "7d" };
    return jwt.sign(payload, this.jwtSecret, options);
  }
}