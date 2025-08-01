import { OAuth2Client } from "google-auth-library";
import { ApiError } from "../../../utils/apiError";
import { TokenService } from "../../token/tokenService";
import { IMechanicRepository } from "../../../repositories/interfaces/IMechanicRepository";
import { IGoogleAuthService } from "./interface/IGoogleAuthService";
import { HttpStatus } from "../../../types/responseCode";
import { Role } from "../../../types/role";

const authClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

export class GoogleAuthService implements IGoogleAuthService {
  constructor(
    private _mechanicRepository: IMechanicRepository,
    private _tokenService: TokenService
  ) {}

  async googleAuth({ code }: { code: string }) {
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
      throw new ApiError("Invalid Google Token");
    }

    const { sub, email, name } = payload;


    let user = await this._mechanicRepository.findByEmail(email);

    if (!user) {
      user = await this._mechanicRepository.save({
        email,
        role: Role.MECHANIC,
        googleId: sub,
        name: name || Role.MECHANIC,
      });
    }

    if (user.googleId !== sub) {
      throw new ApiError("Google ID does not match our records", HttpStatus.FORBIDDEN);
    }

    const tokenPayload = { id: user._id, role: user.role };

    const token = this._tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this._tokenService.generateRefreshToken(tokenPayload);
    await this._mechanicRepository.storeRefreshToken(user._id, refreshToken);

    return {
      token,
      user: {
        name: user.name,
        role: user.role,
      },
    };
  }
}

