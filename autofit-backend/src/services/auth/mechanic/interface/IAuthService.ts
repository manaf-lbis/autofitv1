import { ObjectId } from "mongodb";

export interface IAuthService {
  login(email: string, password: string): Promise<{
    token: string;
    user: { name: string; role: string };
  }>;

  signup(
    name: string,
    email: string,
    password: string,
    mobile: string
  ): Promise<{
    token: string;
    message: string;
  }>;

  refreshAccessToken(userId: string): Promise<{ accessToken: string }>;

  getUser(_id: ObjectId): Promise<{
    name: string;
    role: string;
    email: string;
    mobile: string;
    avatar?: string;
    profileStatus: string | null;
  }>;
}
