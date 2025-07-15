import { IAdminRepository } from "../../../repositories/interfaces/IAdminRepository";
import { OAuth2Client } from "google-auth-library";
import { ApiError } from "../../../utils/apiError";
import { TokenService } from "../../token/tokenService";
import { IAdminGoogleAuthService } from "./interface/IAdminGoogleAuthService";

const authClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

export class AdminGoogleAuthService implements IAdminGoogleAuthService {
  constructor(
    private _adminRepository: IAdminRepository,
    private _tokenService: TokenService
  ) {}

  async loginWithGoogle({ code }: { code: string }) {
    const { tokens } = await authClient.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    authClient.setCredentials(tokens);

    const ticket = await authClient.verifyIdToken({
      idToken: tokens.id_token as string,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new ApiError("Invalid Google Token", 400);
    }

    const { sub, email } = payload;

    const admin = await this._adminRepository.findByEmail(email);

    if (!admin || admin.role !== "admin") {
      throw new ApiError("Access Denied. Not an Admin", 403);
    }

    if (admin.googleId !== sub) {
      throw new ApiError("Google ID does not match our records", 401);
    }

    const tokenPayload = { id: admin._id, role: admin.role };

    const token = this._tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this._tokenService.generateRefreshToken(tokenPayload);
    await this._adminRepository.storeRefreshToken(admin._id, refreshToken);

    return {
      token,
      user: {
        name: admin.name,
        role: admin.role,
        email : admin.email
      },
    };
  }
}