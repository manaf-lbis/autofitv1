import { Socket } from "socket.io";
import * as cookie from "cookie";
import { ApiError } from "../utils/apiError";
import jwt from 'jsonwebtoken'
import { HttpStatus } from "../types/responseCode";


export interface DecodedToken {
    id: string;
    role: string;
}

export const verifyJwt = (socket: Socket): DecodedToken => {
    const cookieHeader = socket.handshake.headers?.cookie || socket.handshake.headers.authorization?.replace("Bearer ", "");

    if (!cookieHeader) {
        throw new ApiError("No cookie found in headers", HttpStatus.UNAUTHORIZED);
    }

    const cookies = cookie.parse(cookieHeader);
    const token = cookies.jwt;

    if (!token) {
        throw new ApiError("JWT token not found", HttpStatus.UNAUTHORIZED);
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    } catch {
        throw new ApiError("Invalid or expired token", HttpStatus.UNAUTHORIZED); 
    }
};