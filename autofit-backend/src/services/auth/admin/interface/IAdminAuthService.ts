import { Types } from "mongoose";

export interface IAdminAuthService {
  login(email: string, password: string): Promise<{ token: string; user: { name: string; role: string } }>;

  validateRefreshToken(token: string): Promise<string>;

  refreshAccessToken(userId: string): Promise<{ accessToken: string }>;

  getUser(id: Types.ObjectId): Promise<{ name: string; role: string; email: string }>;
}