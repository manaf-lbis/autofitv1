import { OAuth2Client } from "google-auth-library";
import { ApiError } from "../../../utils/apiError";
import { TokenService } from "../../token/tokenService";
import { IMechanicRepository } from "../../../repositories/interfaces/IMechanicRepository";

const authClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

export class GoogleAuthService {
  constructor(
    private mechanicRepository: IMechanicRepository,
    private tokenService: TokenService
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


    let user = await this.mechanicRepository.findByEmail(email);

    if (!user) {
      user = await this.mechanicRepository.create({
        email,
        role: "mechanic",
        googleId: sub,
        name: name || "mechanic",
      });
    }

    if (user.googleId !== sub) {
      throw new ApiError("Google ID does not match our records", 401);
    }

    const tokenPayload = { id: user._id, role: user.role };

    const token = this.tokenService.generateToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);
    await this.mechanicRepository.storeRefreshToken(user._id, refreshToken);

    return {
      token,
      user: {
        name: user.name,
        role: user.role,
      },
    };
  }
}

