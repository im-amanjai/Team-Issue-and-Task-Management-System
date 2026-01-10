import axiosInstance from "./axiosInstance";

export const loginUser = async (data) => {
  const res = await axiosInstance.post("api/auth/login", data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await axiosInstance.post("api/auth/signup", data);
  return res.data;
};
