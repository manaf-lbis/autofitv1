export type Role = "user" | "admin" | "mechanic";

export interface LoginRequest {
  email: string;
  password: string;
  role: Role;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: Exclude<Role, "admin">; 
}

export interface AuthResponse {
  status: "success" | "error";
  data: {
    name: string;
    role: Role;
  };
}

export interface GoogleLoginRequest {
  code: string;
  role: Role;
}

export interface LogoutResponse {
  status: string;
  message: string;
}