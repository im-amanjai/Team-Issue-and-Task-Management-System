import axiosInstance from "./axiosInstance";

export const getCommentsByIssue = async (issueId) => {
  const response = await axiosInstance.get(`/api/comments/issue/${issueId}`);
  return response.data;
};

export const addComment = async (payload) => {
  const response = await axiosInstance.post("/api/comments", payload);
  return response.data;
};

export const deleteComment = async (id) => {
  const response = await axiosInstance.delete(`/api/comments/${id}`);
  return response.data;
};
