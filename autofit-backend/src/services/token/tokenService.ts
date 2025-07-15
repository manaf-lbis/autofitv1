import jwt, { SignOptions, JwtPayload, VerifyOptions } from "jsonwebtoken";
import { ITokenService } from "./ITokenService";

export class TokenService implements ITokenService{
  private _jwtSecret: string;

  constructor() {

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    this._jwtSecret = process.env.JWT_SECRET;
  }

  verifyToken(token: string, ignoreExpiration: boolean = false): JwtPayload {
    const options: VerifyOptions = { ignoreExpiration };
    const decoded = jwt.verify(token, this._jwtSecret, options);
    
    if (typeof decoded === "string") {
      throw new Error("Invalid token payload");
    }
    return decoded as JwtPayload;
  }

  generateAccessToken(payload: object): string {
    const options: SignOptions = { expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION)};
    return jwt.sign(payload, this._jwtSecret, options);
  }

  generateRefreshToken(payload: object): string {
    const options: SignOptions = { expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION) };
    return jwt.sign(payload, this._jwtSecret, options);
  }


}