import { IUserRepository } from "../../../repositories/interfaces/IUserRepository";
import { OAuth2Client } from "google-auth-library";
import { ApiError } from "../../../utils/apiError";
import { TokenService } from "../../token/tokenService";

const authClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

export class GoogleAuthService {
  constructor(
    private _userRepository: IUserRepository,
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


    let user = await this._userRepository.findByEmail(email);

    if (!user) {
      user = await this._userRepository.create({
        email,
        role: "user",
        googleId: sub,
        name: name || "User",
      });
    }

    if (user.googleId !== sub) {
      throw new ApiError("Google ID does not match our records", 401);
    }

    const tokenPayload = { id: user._id, role: user.role };

    const token = this._tokenService.generateToken(tokenPayload);
    const refreshToken = this._tokenService.generateRefreshToken(tokenPayload);
    await this._userRepository.storeRefreshToken(user._id, refreshToken);

    return {
      token,
      user: {
        name: user.name,
        role: user.role,
        email: user.email
      },
    };
  }
}

