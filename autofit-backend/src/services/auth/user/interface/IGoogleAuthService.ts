export interface IGoogleAuthService {
  googleAuth(params: { code: string }): Promise<{
    token: string;
    user: {
      name: string;
      role: string;
      email: string;
    };
  }>;
}
