import { Socket } from "socket.io";
import * as cookie from "cookie";
import { ApiError } from "../utils/apiError";
import jwt from 'jsonwebtoken'


export interface DecodedToken {
    id: string;
    role: string;
}

export const verifyJwt = (socket: Socket): DecodedToken => {
    try {
        const cookieHeader = socket.handshake.headers?.cookie;

        if (!cookieHeader) {
            throw new ApiError("No cookie found in headers", 401);
        }

        const cookies = cookie.parse(cookieHeader);
        const token = cookies.jwt;

        if (!token) {
            throw new ApiError("JWT token not found", 401);
        }

        return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;


    } catch (error) {
        console.log(error);
        throw new ApiError("Invalid or expired token", 401);
    }


}