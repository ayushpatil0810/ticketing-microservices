import axios from "axios";

const apiClient = axios.create({
  withCredentials: true,
});

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: {
    fieldErrors?: Record<string, string[]>;
    formErrors?: string[];
  };
}

export type SignupBody = {
  username: string;
  email: string;
  password: string;
};

export type SigninBody = {
  email: string;
  password: string;
};

export const signup = (body: SignupBody): Promise<ApiResponse<User>> =>
  apiClient.post<ApiResponse<User>>("/api/auth/signup", body).then((res) => res.data);

export const signin = (body: SigninBody): Promise<ApiResponse<User>> =>
  apiClient.post<ApiResponse<User>>("/api/auth/signin", body).then((res) => res.data);

export const signout = (): Promise<ApiResponse<void>> =>
  apiClient.post<ApiResponse<void>>("/api/auth/signout").then((res) => res.data);

export const getCurrentUser = (): Promise<ApiResponse<User>> =>
  apiClient.get<ApiResponse<User>>("/api/auth/currentuser").then((res) => res.data);