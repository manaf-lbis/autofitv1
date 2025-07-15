import { JwtPayload } from "jsonwebtoken";

export interface ITokenService {
  verifyToken(
    token: string,
    ignoreExpiration?: boolean
  ): JwtPayload;

  generateAccessToken(payload: object): string;

  generateRefreshToken(payload: object): string;
}
