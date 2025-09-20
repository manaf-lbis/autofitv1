import { IUserRepository } from "../../../repositories/interfaces/IUserRepository";
import { OAuth2Client } from "google-auth-library";
import { ApiError } from "../../../utils/apiError";
import { TokenService } from "../../token/tokenService";
import { IGoogleAuthService } from "./interface/IGoogleAuthService";
import { HttpStatus } from "../../../types/responseCode";
import { Role } from "../../../types/role";

export class GoogleAuthService implements IGoogleAuthService {
  constructor(
    private _userRepository: IUserRepository,
    private _tokenService: TokenService
  ) { }

  async googleAuth({ code, codeVerifier }: { code: string; codeVerifier?: string }) {
    if (!code) throw new ApiError("Authorization code is required", HttpStatus.BAD_REQUEST);

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      throw new ApiError("Server OAuth configuration missing", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const authClient = new OAuth2Client(clientId, clientSecret);

    try {
      const getTokenParams: any = { code, redirect_uri: redirectUri };
      if (codeVerifier) getTokenParams.codeVerifier = codeVerifier;

      const { tokens } = await authClient.getToken(getTokenParams);
      authClient.setCredentials(tokens);

      if (!tokens.id_token) {
        throw new ApiError("id_token not returned by Google. Make sure 'openid' scope was requested.", HttpStatus.BAD_REQUEST);
      }

      const ticket = await authClient.verifyIdToken({
        idToken: tokens.id_token as string,
        audience: clientId,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new ApiError("Invalid Google token payload", HttpStatus.BAD_REQUEST);
      }

      const { sub, email, name } = payload;

      let user = await this._userRepository.findByEmail(email);

      if (!user) {
        user = await this._userRepository.save({
          email,
          role: Role.USER,
          googleId: sub,
          name: name || Role.USER,
        });
      } else {
        if (!user.googleId) {
          await this._userRepository.update(user._id, { googleId: sub });
          user.googleId = sub;
        }

        if (user.googleId !== sub) {
          throw new ApiError("Google ID does not match our records", HttpStatus.FORBIDDEN);
        }

        if(user.status === 'blocked') throw new ApiError('User Blocked Contact Admin', HttpStatus.UNAUTHORIZED);
      }

      const tokenPayload = { id: user._id, role: user.role };
      const token = this._tokenService.generateAccessToken(tokenPayload);
      const refreshToken = this._tokenService.generateRefreshToken(tokenPayload);
      await this._userRepository.storeRefreshToken(user._id, refreshToken);

      return {
        token,
        user: {
          name: user.name,
          role: user.role,
          email: user.email,
        },
      };
    } catch (error :any) {
      throw new ApiError(error);
    }
  }
}
