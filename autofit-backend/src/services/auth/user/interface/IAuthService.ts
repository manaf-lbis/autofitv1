import { ObjectId } from "mongodb";
import { Types } from "mongoose";

export interface IAuthService {
    login(email: string, password: string): Promise<{
        token: string;
        user: {
            name: string;
            role: string;
        };
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

    getUser(
        _id: ObjectId
    ): Promise<{
        name: string;
        role: string;
        email: string;
        mobile: string;
    }>;

    validateRefreshToken(token: string): Promise<string>;
    logout(userId: Types.ObjectId): Promise<void>;

    refreshAccessToken(
        userId: string
    ): Promise<{
        accessToken: string;
    }>;
}
