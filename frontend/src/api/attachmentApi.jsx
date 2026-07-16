import axiosInstance from "./axiosInstance";

export const uploadAttachment = async (issueId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post(
    `/api/attachments/${issueId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const getAttachmentsByIssue = async (issueId) => {
  const response = await axiosInstance.get(`/api/attachments/issue/${issueId}`);
  return response.data;
};

export const deleteAttachment = async (id) => {
  const response = await axiosInstance.delete(`/api/attachments/${id}`);
  return response.data;
};
