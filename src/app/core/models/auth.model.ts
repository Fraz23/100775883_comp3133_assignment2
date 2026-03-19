export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}
