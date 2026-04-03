import axiosInstance from "./axiosInstance";

export const getDashboardData = async (role) => {
  const response = await axiosInstance.get(`/api/dashboard/${role}`);
  return response.data;
};
