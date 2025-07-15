export interface IAdminGoogleAuthService {
  loginWithGoogle(data: { code: string }): Promise<{
    token: string;
    user: {
      name: string;
      role: string;
      email: string;
    };
  }>;
}