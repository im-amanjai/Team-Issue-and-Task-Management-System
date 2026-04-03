import axiosInstance from "./axiosInstance";

export const getIssues = async (params = {}) => {
  const response = await axiosInstance.get("/api/issues", { params });
  return response.data;
};

export const getIssueById = async (id) => {
  const response = await axiosInstance.get(`/api/issues/${id}`);
  return response.data;
};

export const createIssue = async (payload) => {
  const response = await axiosInstance.post("/api/issues", payload);
  return response.data;
};

export const updateIssue = async (id, payload) => {
  const response = await axiosInstance.patch(`/api/issues/${id}`, payload);
  return response.data;
};

export const assignIssue = async (id, assignee) => {
  const response = await axiosInstance.patch(`/api/issues/${id}/assign`, {
    assignee,
  });
  return response.data;
};

export const updateIssueStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/api/issues/${id}/status`, {
    status,
  });
  return response.data;
};

export const deleteIssue = async (id) => {
  const response = await axiosInstance.delete(`/api/issues/${id}`);
  return response.data;
};
