import axiosInstance from "./axiosInstance";

export const getUsers = async (params = {}) => {
  const response = await axiosInstance.get("/api/users", { params });
  return response.data;
};

export const getAssignableUsers = async () => {
  const response = await axiosInstance.get("/api/users/assignable");
  return response.data;
};

export const createUser = async (payload) => {
  const response = await axiosInstance.post("/api/users", payload);
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await axiosInstance.patch(`/api/users/${id}/role`, { role });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/api/users/${id}`);
  return response.data;
};
