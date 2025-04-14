import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

export class TokenService {
  private jwtSecret: string;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    this.jwtSecret = process.env.JWT_SECRET;
  }

  generateToken(payload: object, expiresIn: `${number}${'s' | 'm' | 'h' | 'd'}` = '1h'): string {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, this.jwtSecret, options);
  }

  verifyToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, this.jwtSecret);
    if (typeof decoded === 'string') {
      throw new Error("Invalid token payload");
    }
    return decoded as JwtPayload;
  }
}