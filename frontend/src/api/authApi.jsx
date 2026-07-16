import axiosInstance from "./axiosInstance";

export const loginUser = async (data) => {
  const response = await axiosInstance.post("/api/auth/login", data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await axiosInstance.post("/api/auth/signup", data);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("/api/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await axiosInstance.post("/api/auth/reset-password", data);
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axiosInstance.patch("/api/auth/profile", data);
  return response.data;
};
